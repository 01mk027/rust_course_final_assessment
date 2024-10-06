use auth::{with_auth, Role};
use chrono::{NaiveDateTime, Utc, TimeDelta};
use error::Error::*;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, iter::Product};
use std::convert::Infallible;
use std::sync::Arc;
use warp::{reject, reply, Filter, Rejection, Reply};
use warp::http::Method;

mod product;
mod sales;
mod purchase;

mod auth;
mod error;

type Result<T> = std::result::Result<T, error::Error>;
type WebResult<T> = std::result::Result<T, Rejection>;
type Users = Arc<HashMap<String, User>>;

#[derive(Clone)]
pub struct User {
    pub uid: String,
    pub email: String,
    pub pw: String,
    pub role: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub pw: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub username: String
}

#[derive(Deserialize)]

pub struct ProductAdd{
    name: String,
    description: String,
    quantity: i32,
    image_path: String
}


#[derive(Deserialize)]

pub struct ProductUpdate{
    id: i32,
    name: String,
    description: String,
    quantity: i32,
    image_path: String
}

#[derive(Deserialize)]
pub struct DeleteProduct{
    id: i32
}

#[derive(Deserialize)]
pub struct FetchSingleProduct{
    id: i32
}

#[derive(Deserialize)]
pub struct AddSale{
    product_id: i32,
    pieces: i32,
    price: f64
}

#[derive(Deserialize)]
pub struct UpdateSale {
    id: i32,
    product_id: i32,
    pieces: i32,
    price: f64
}

#[derive(Deserialize)]
pub struct DeleteSale{
    id: i32
}

#[derive(Deserialize)]
pub struct FetchSingleSale{
    id: i32
}

#[derive(Deserialize)]
pub struct AddPurchase{
    product_id: i32,
    pieces: i32,
    price: f64
}

#[derive(Deserialize)]
pub struct UpdatePurchase {
    id: i32,
    product_id: i32,
    pieces: i32,
    price: f64
}

#[derive(Deserialize)]
pub struct DeletePurchase{
    id: i32
}

#[derive(Deserialize)]
pub struct FetchSinglePurchase{
    id: i32
}



#[tokio::main]
async fn main() {
    let users = Arc::new(init_users());

    let cors = warp::cors().allow_any_origin()
        .allow_headers(vec!["Access-Control-Allow-Headers", "Access-Control-Request-Method", "Access-Control-Request-Headers", "Origin", "Accept", "X-Requested-With", "Content-Type", "Authorization"])
        .allow_methods(&[Method::GET, Method::POST, Method::PUT, Method::PATCH, Method::DELETE, Method::OPTIONS, Method::HEAD]);

    let login_route = warp::path!("login")
        .and(warp::post())
        .and(with_users(users.clone()))
        .and(warp::body::json())
        .and_then(login_handler)
        .with(cors.clone());

    let user_route = warp::path!("user")
        .and(with_auth(Role::User))
        .and(with_users(users.clone()))
        .and_then(user_handler)
        .with(cors.clone());


    let admin_route = warp::path!("admin")
        .and(with_auth(Role::Admin))
        .and_then(admin_handler);

    let product_adding_route = warp::path!("product"/"addproduct")
        .and(warp::post())
        .and(with_auth(Role::Admin))
        .and(warp::body::json())
        .and_then(product_adding_handler)
        .with(cors.clone());

    let product_list_route = warp::path!("product"/"listproducts")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and_then(product_listing_handler)
    .with(cors.clone());

    let fetch_single_product = warp::path!("product"/"fetchsingleproduct")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(fetch_single_product)
    .with(cors.clone());


    let product_update_route = warp::path!("product" / "updateproduct")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(product_update_handler)
    .with(cors.clone());

    let product_delete_route = warp::path!("product"/"deleteproduct")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(product_deleting_handler)
    .with(cors.clone());

    let sale_add_route = warp::path!("sale" / "addsale")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(sale_add_handler)
    .with(cors.clone());

    let sale_update_route = warp::path!("sale" / "updatesale")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(sale_update_handler)
    .with(cors.clone());

    let sale_list_route = warp::path!("sale"/"listsales")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and_then(sale_list_handler)
    .with(cors.clone());

    let sale_delete_route = warp::path!("sale" / "deletesale")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(sale_delete_handler)
    .with(cors.clone());

    let fetch_single_sale = warp::path!("sale" / "fetchsinglesale")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(fetch_single_sale)
    .with(cors.clone());

    let purchase_add_route = warp::path!("purchase" / "addpurchase")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(purchase_add_handler)
    .with(cors.clone());

    let purchase_update_route = warp::path!("purchase" / "updatepurchase")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(purchase_update_handler)
    .with(cors.clone());

    let purchase_list_route = warp::path!("purchase"/"listpurchases")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and_then(purchase_list_handler)
    .with(cors.clone());

    let purchase_delete_route = warp::path!("purchase" / "deletepurchase")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(purchase_delete_handler)
    .with(cors.clone());

    let fetch_single_purchase = warp::path!("purchase" / "fetchsinglepurchase")
    .and(warp::post())
    .and(with_auth(Role::Admin))
    .and(warp::body::json())
    .and_then(fetch_single_purchase)
    .with(cors.clone());


    let routes = login_route
        .or(user_route)
        .or(admin_route)
        .or(product_adding_route)
        .or(product_list_route)
        .or(product_update_route)
        .or(product_delete_route)
        .or(fetch_single_product)
        .or(sale_add_route)
        .or(sale_update_route)
        .or(sale_list_route)
        .or(sale_delete_route)
        .or(fetch_single_sale)
        .or(purchase_add_route)
        .or(purchase_update_route)
        .or(purchase_list_route)
        .or(purchase_delete_route)
        .or(fetch_single_purchase)
        .recover(error::handle_rejection);

    warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
}

fn with_users(users: Users) -> impl Filter<Extract = (Users,), Error = Infallible> + Clone {
    warp::any().map(move || users.clone())
}

pub async fn login_handler(users: Users, body: LoginRequest) -> WebResult<impl Reply> {
    match users
        .iter()
        .find(|(_uid, user)| user.email == body.email && user.pw == body.pw)
    {
        Some((uid, user)) => {
            let token = auth::create_jwt(&uid, &Role::from_str(&user.role))
                .map_err(|e| reject::custom(e))?;
            Ok(reply::json(&LoginResponse { token, username: body.email }))
        }
        None => Err(reject::custom(WrongCredentialsError)),
    }
}

pub async fn user_handler(uid: String, user: Users) -> WebResult<impl Reply> {
    Ok(format!("Hello User {}", uid))
}

pub async fn admin_handler(uid: String) -> WebResult<impl Reply> {
    Ok(format!("Hello Admin {}", uid))
}

pub async fn product_adding_handler(add_product: String, product_info: ProductAdd) -> WebResult<impl Reply>
{
    let mut product = product::product::Product::new();
    product.description = product_info.description;
    product.name = product_info.name;
    
    product.quantity = product_info.quantity;
    product.created_at = Utc::now().checked_add_signed(TimeDelta::hours(3)).unwrap();
    product.image_path = product_info.image_path;
    match product.add_product()
    {
        Ok(e) => return Ok(format!("{:?}", e)),
        Err(_) => return Err(reject::custom(ProductAddingError))
    }   
}

pub async fn product_update_handler(_: String, product_update: ProductUpdate) -> WebResult<impl Reply>
{
    let mut product = product::product::Product::new();
    product.id = product_update.id;
    product.description = product_update.description;
    product.name = product_update.name;
    product.updated_at = Some(Utc::now().checked_add_signed(TimeDelta::hours(3)).unwrap());
    product.quantity = product_update.quantity;
    product.image_path = product_update.image_path;
    match product.update_product()
    {
        Ok(e) => return Ok(format!("{:?}", e)),
        Err(_) => return Err(reject::custom(ProductUpdatingError))
    }
}


pub async fn product_listing_handler(_:String) -> WebResult<impl Reply>
{
    let product = product::product::Product::new();    
    return Ok(format!("{:?}", product.list_products().unwrap()));
}

pub async fn product_deleting_handler(_:String, delete_product: DeleteProduct) -> WebResult<impl Reply>
{
    let product = product::product::Product::new();
    product.delete_product(delete_product.id);
    return Ok(format!("Product deleted!"));
}

pub async fn fetch_single_product(_: String, fetch_single_product: FetchSingleProduct) -> WebResult<impl Reply>
{
    let product = product::product::Product::new();
    match product.fetch_single_product(fetch_single_product.id){
        Some(v) => return Ok(format!("{:?}", v)),
        None => return Err(reject::custom(ProductFetchingError))
    }
}

pub async fn sale_add_handler(_: String, add_sale: AddSale ) -> WebResult<impl Reply>
{
    let mut sale = sales::sales::Sale::new();
    sale.pieces = add_sale.pieces;
    sale.product_id = add_sale.product_id;
    sale.price = add_sale.price;
    sale.created_at = Utc::now().checked_add_signed(TimeDelta::hours(3)).unwrap();
    match sale.add_sale(){
        Ok(v) => return Ok(format!("{:?}", v)),
        Err(_) => return Err(reject::custom(SaleAddError))
    };
}


pub async fn sale_update_handler(_: String, update_sale: UpdateSale) -> WebResult<impl Reply>
{
    let mut sale = sales::sales::Sale::new();
    sale.id = update_sale.id;
    sale.pieces = update_sale.pieces;
    sale.price = update_sale.price;
    sale.product_id = update_sale.product_id;
    sale.updated_at = Some(Utc::now().checked_add_signed(TimeDelta::hours(3)).unwrap());
    match sale.update_sale(){
        Ok(v) => return Ok(format!("{:?}", v)),
        Err(_) => return Err(reject::custom(SaleUpdateError))
    }
}

pub async fn sale_list_handler(_: String) -> WebResult<impl Reply>
{
    let sale = sales::sales::Sale::new();
    return Ok(format!("{:?}", sale.list_sales().unwrap()));

}

pub async fn sale_delete_handler(_:String, delete_sale: DeleteSale) -> WebResult<impl Reply>
{
    let sale = sales::sales::Sale::new();
    sale.delete_sale(delete_sale.id);
    return Ok(format!("Sale deleted!"));
}

pub async fn fetch_single_sale(_: String, fetch_single_sale: FetchSingleSale) -> WebResult<impl Reply>
{
    let sale = sales::sales::Sale::new();
    match sale.fetch_single_sale(fetch_single_sale.id)
    {
        Some(v) => return Ok(format!("{:?}", v)),
        None => return Err(reject::custom(SaleFetchingError))
    }
}

pub async fn purchase_add_handler(_: String, add_purchase: AddPurchase ) -> WebResult<impl Reply>
{
    let mut purchase = purchase::purchase::Purchase::new();
    purchase.pieces = add_purchase.pieces;
    purchase.product_id = add_purchase.product_id;
    purchase.price = add_purchase.price;
    purchase.created_at = Utc::now().checked_add_signed(TimeDelta::hours(3)).unwrap();
    match purchase.add_purchase(){
        Ok(v) => return Ok(format!("{:?}", v)),
        Err(_) => return Err(reject::custom(PurchaseAddingError))
    };
}


pub async fn purchase_update_handler(_: String, update_purchase: UpdatePurchase) -> WebResult<impl Reply>
{
    let mut purchase = purchase::purchase::Purchase::new();
    purchase.id = update_purchase.id;
    purchase.pieces = update_purchase.pieces;
    purchase.price = update_purchase.price;
    purchase.product_id = update_purchase.product_id;
    purchase.updated_at = Some(Utc::now().checked_add_signed(TimeDelta::hours(3)).unwrap());
    match purchase.update_purchase(){
        Ok(v) => return Ok(format!("{:?}", v)),
        Err(_) => return Err(reject::custom(SaleUpdateError))
    }
}

pub async fn purchase_list_handler(_: String) -> WebResult<impl Reply>
{
    let purchase = purchase::purchase::Purchase::new();
    return Ok(format!("{:?}", purchase.list_purchases().unwrap()));

}

pub async fn purchase_delete_handler(_:String, delete_purchase: DeletePurchase) -> WebResult<impl Reply>
{
    let purchase = purchase::purchase::Purchase::new();
    purchase.delete_purchase(delete_purchase.id);
    return Ok(format!("Purchase deleted!"));
}

pub async fn fetch_single_purchase(_: String, fetch_single_purchase: FetchSinglePurchase) -> WebResult<impl Reply>
{
    let purchase = purchase::purchase::Purchase::new();
    match purchase.fetch_single_purchase(fetch_single_purchase.id)
    {
        Some(v) => return Ok(format!("{:?}", v)),
        None => return Err(reject::custom(PurchaseFetchingError))
    }
}



fn init_users() -> HashMap<String, User> {
    let mut map = HashMap::new();
    map.insert(
        String::from("1"),
        User {
            uid: String::from("1"),
            email: String::from("user@userland.com"),
            pw: String::from("1234"),
            role: String::from("User"),
        },
    );
    map.insert(
        String::from("2"),
        User {
            uid: String::from("2"),
            email: String::from("admin@adminaty.com"),
            pw: String::from("4321"),
            role: String::from("Admin"),
        },
    );
    map
}
