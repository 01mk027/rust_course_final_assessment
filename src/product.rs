pub mod product{
    use serde::{Serialize, Deserialize};
    use postgres::{Client, NoTls, Error};
    use chrono::{DateTime, NaiveDateTime, Utc, Duration};


    #[derive(Debug, Serialize, Deserialize)]
    pub struct Product{
        pub id: i32,
        pub name: String,
        pub description: String,
        pub quantity: i32,
        pub created_at: DateTime<Utc>,
        pub updated_at: Option<DateTime<Utc>>,
        pub image_path: String
    }

    impl Product{
        pub fn new() -> Self
        {
            // ask for database table, if doesnt exist, create!
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
            
            
            client.batch_execute(
                "
                CREATE TABLE IF NOT EXISTS products (
                    id                 SERIAL PRIMARY KEY,
                    name               VARCHAR UNIQUE NOT NULL,
                    description        VARCHAR NOT NULL,
                    quantity           INT NOT NULL,
                    created_at         TIMESTAMP,
                    updated_at         TIMESTAMP,
                    image_path         VARCHAR    
                    )
            ",
            ).expect("Error on creating table");
            

            return Product{
                id: -1,
                name : "".to_string(),
                description: "".to_string(),
                quantity: 0, //name, description, purchasing_price, quantity, selling_price
                created_at: Utc::now(),
                updated_at: Some(Utc::now()),
                image_path: "_".to_string()
            };
        }


        pub fn list_products(&self) -> Option<String>
        {
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
            let rows = client.query("SELECT * FROM products", &[]).expect("Error fetching products");

            let mut products: Vec<Product> = vec![];
            for row in &rows {
                let created_at_naive: NaiveDateTime = row.get(4);
                let created_at = DateTime::<Utc>::from_utc(created_at_naive, Utc);
    
                let updated_at_naive: Option<NaiveDateTime> = row.get(5);
                let updated_at = updated_at_naive.map(|naive| DateTime::<Utc>::from_utc(naive, Utc));
    
                let product = Product{
                        id: row.get::<usize, i32>(0),
                        name: row.get::<usize, String>(1),
                        description: row.get::<usize, String>(2),
                        quantity: row.get::<usize, i32>(3),
                        created_at,
                        updated_at,
                        image_path: row.get::<usize, String>(6)
                    };

                    products.push(product);
                }
                let json_products = serde_json::to_string(&products).expect("Error serializing products");
                return Some(json_products);
            }

        
        pub fn fetch_single_product(&self, id: i32) -> Option<String>
        {
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
            let rows = client.query("SELECT * FROM products WHERE id=$1", &[&id]).expect("Error fetching single product.");


            let mut products = vec![];
            for row in &rows {
                let created_at_naive: NaiveDateTime = row.get(4);
                let created_at = DateTime::<Utc>::from_utc(created_at_naive, Utc);
    
                let updated_at_naive: Option<NaiveDateTime> = row.get(5);
                let updated_at = updated_at_naive.map(|naive| DateTime::<Utc>::from_utc(naive, Utc));
    
                let product = Product{
                        id: row.get::<usize, i32>(0),
                        name: row.get::<usize, String>(1),
                        description: row.get::<usize, String>(2),
                        quantity: row.get::<usize, i32>(3),
                        created_at,
                        updated_at,
                        image_path: row.get::<usize, String>(6)
                    };

                    products.push(product);
                }
                let single_product = &products[0];
                let json_single_product = serde_json::to_string(&single_product).expect("Error on serializing single product");

            return Some(json_single_product);
        }
            
            
            
        

        pub fn add_product(&self) -> Result<&str, &str>{
            //Ekleme işlemi buradan başlar
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");

            

            client.execute(
                "INSERT INTO products (name, description, quantity, created_at, image_path) VALUES ($1, $2, $3, $4, $5)",
                &[&self.name, &self.description, &self.quantity, &self.created_at.naive_local(), &self.image_path],
            ).expect("Error on inserting");

            return Ok("Product is added successfully!");
        }

        pub fn update_product(&self) -> Result<&str, &str>{
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");


            let updated_at_naive = self.updated_at.map(|dt| dt.naive_utc());


            client.execute("UPDATE products SET name=$1, description=$2, quantity=$3, updated_at=$4, image_path=$5 WHERE id=$6",
                &[&self.name, &self.description, &self.quantity, &updated_at_naive as &(dyn postgres::types::ToSql + Sync), &self.image_path, &self.id]
            ).expect("Error on updating product");

            return Ok("Product is updated successfully!");
        }

        pub fn delete_product(&self, id: i32) -> Result<(), Error>{
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");

            client.execute("DELETE FROM products WHERE id=$1", &[&id]).expect("Error on product deleting");
            return Ok(());
        }
    }
}