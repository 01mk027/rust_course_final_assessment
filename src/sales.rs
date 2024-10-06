pub mod sales {
    use chrono::{DateTime, NaiveDateTime, Utc};
    use serde::{Serialize, Deserialize};
    use postgres::{Client, NoTls, Error};
    use warp::reject;
    

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Sale{
        pub id: i32,
        pub product_id: i32,
        pub pieces: i32,
        pub price: f64,
        pub created_at: DateTime<Utc>,
        pub updated_at: Option<DateTime<Utc>>
    }

    impl Sale{
        pub fn new() -> Self {
            // ask for database table, if doesnt exist, create!
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");

            client.batch_execute("CREATE TABLE IF NOT EXISTS sales(
                id SERIAL PRIMARY KEY,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                pieces INT NOT NULL,
                price DOUBLE PRECISION NOT NULL,
                created_at         TIMESTAMP,
                updated_at         TIMESTAMP
            )").expect("Error on creating table");

            return Sale{
                id: -1,
                product_id: -1,
                pieces: 0,
                price: 0.0,
                created_at: Utc::now(),
                updated_at: Some(Utc::now())
            };
        }

        pub fn add_sale(&self) -> Result<&str, &str>{
            // ask for database table, if doesnt exist, create!
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
        
            // check for product which as incoming id...
            //self.product_id

            let does_exist = client.query("SELECT * FROM products WHERE id=$1", &[&self.product_id]).expect("Error querying product");
            if does_exist.len() == 0 {
                return Err("Entered product id doesn't match with any records");
            }
            
                
            let row = client.query_one("INSERT INTO sales (product_id, pieces, price, created_at) VALUES ($1, $2, $3, $4) RETURNING id, product_id, pieces, price, created_at", 
            &[&self.product_id, &self.pieces, &self.price, &self.created_at.naive_local()],
            ).expect("Error on adding sale");

            //let created_at_naive: NaiveDateTime = row.get(4);
            //let created_at = DateTime::<Utc>::from_utc(created_at_naive, Utc);

            return Ok("Sale added successfully!");
        }

        pub fn update_sale(&self) -> Result<&str, &str>{
            // ask for database table, if doesnt exist, create!
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
        
            // check for product which as incoming id...
            //self.product_id

            let does_exist = client.query("SELECT * FROM sales WHERE id=$1", &[&self.id]).expect("Error querying product");
            if does_exist.len() == 0 {
                return Err("Entered sales id doesn't match with any records");
            }

            let updated_at_naive = self.updated_at.map(|dt| dt.naive_utc());


            client.execute("UPDATE sales SET pieces=$1, price=$2, updated_at=$3, product_id=$4 WHERE id=$5 RETURNING id, product_id, pieces, price, updated_at",
                &[&self.pieces, &self.price, &updated_at_naive as &(dyn postgres::types::ToSql + Sync), &self.product_id,  &self.id]
            ).expect("Error on updating sale");

            return Ok("Sale updated successfully!");
        }

        pub fn list_sales(&self) -> Option<String>
        {
            let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
            let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
            let rows = client.query("SELECT * FROM sales", &[]).expect("Error fetching sales");

            let mut sales: Vec<Sale> = vec![];
            for row in &rows {
                let created_at_naive: NaiveDateTime = row.get(4);
                let created_at = DateTime::<Utc>::from_utc(created_at_naive, Utc);
    
                let updated_at_naive: Option<NaiveDateTime> = row.get(5);
                let updated_at = updated_at_naive.map(|naive| DateTime::<Utc>::from_utc(naive, Utc));
    
                let sale = Sale{
                        id: row.get(0),
                        product_id: row.get(1),
                        pieces: row.get(2),
                        price: row.get(3),
                        created_at,
                        updated_at
                    };

                    sales.push(sale);
                }
                let json_sales = serde_json::to_string(&sales).expect("Error serializing sales.");
                return Some(json_sales);
            }

            pub fn delete_sale(&self, id: i32) -> Result<(), &str>{
                let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
                let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
    
                client.execute("DELETE FROM sales WHERE id=$1", &[&id]).expect("Error on product deleting");
                return Ok(());
            }

            pub fn fetch_single_sale(&self, id: i32) -> Option<String>
            {
                let connection_string = "host=localhost user=neverrun password=123456 dbname=rust_course_final_assessment";
                let mut client = Client::connect(&connection_string, NoTls).expect("Error on connection");
                let rows = client.query("SELECT * FROM sales WHERE id=$1", &[&id]).expect("Error fetching single sale");
               
                let mut sales: Vec<Sale> = vec![];
                for row in &rows {
                    let created_at_naive: NaiveDateTime = row.get(4);
                    let created_at = DateTime::<Utc>::from_utc(created_at_naive, Utc);
        
                    let updated_at_naive: Option<NaiveDateTime> = row.get(5);
                    let updated_at = updated_at_naive.map(|naive| DateTime::<Utc>::from_utc(naive, Utc));
        
                    let sale = Sale{
                            id: row.get(0),
                            product_id: row.get(1),
                            pieces: row.get(2),
                            price: row.get(3),
                            created_at,
                            updated_at
                        };

                        sales.push(sale);
                    }
                    let single_sale = &sales[0];
                    let json_sales = serde_json::to_string(&single_sale).expect("Error serializing sales.");
                    return Some(json_sales);
                
            }
            


    }
}