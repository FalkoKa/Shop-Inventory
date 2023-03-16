CREATE DATABASE project2;

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    email TEXT, 
    username TEXT, 
    password_digest TEXT,
    isUser BOOLEAN, 
    isAdmin BOOLEAN
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT,
    category_description TEXT
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    title TEXT,
    item_description TEXT,
    image_url TEXT, 
    price NUMERIC,
    stock INTEGER,
    user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    cat_id INTEGER REFERENCES categories (category_id) ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    input TEXT,
    post_date TIMESTAMP DEFAULT NOW(),
    fk_item_key INTEGER REFERENCES items (item_id) ON DELETE CASCADE,
    fk_user_id INTEGER REFERENCES users (id) ON DELETE CASCADE
);



select comment_id, input, post_date, fk_user_id, username from comments join users on fk_user_id  = id;


INSERT INTO categories (category_name, category_description) VALUES ('Shoes', 'Shoes can be defined as an outer covering for the human foot typically having a thick or stiff sole with an attached heel and an upper part of lighter material (such as leather)');
INSERT INTO categories (category_name, category_description) VALUES ('Shirts', 'Shirts can be defined as a garment for the upper part of the body usually with a collar, sleeves, a front opening, and a tail long enough to be tucked inside pants or a skirt.');

INSERT INTO items (title, item_description, image_url, price, stock, user_id, cat_id) VALUES ('Air Force', 'Designed by Bruce Kilgore and introduced in 1982, the Air Force 1 was the first-ever basketball shoe to feature Nike Air technology', 'https://static.nike.com/a/images/t_default/c6d9d042-f0b9-46a3-bd1f-04e16541a1d9/air-force-1-07-next-nature-shoes-cg65FM.png', 119.99, 10, 1, 1);
INSERT INTO items (title, item_description, image_url, price, stock, user_id, cat_id) VALUES ('Fancy Shoes', 'This is a fancy black leather shoe designed by whoever', 'https://pyxis.nymag.com/v1/imgs/3e4/160/12929765dae08fb2dbfe5327d557bc37bf-rockport-big-bucks-margin.rhorizontal.w600.jpg', 199.99, 3, 1, 1);



"items_cat_id_fkey" FOREIGN KEY (cat_id) REFERENCES categories(category_id)

ALTER TABLE items
   DROP CONSTRAINT items_cat_id_fkey
   ADD  CONSTRAINT items_cat_id_fkey
   FOREIGN KEY (cat_id) REFERENCES categories (category_id) ON DELETE CASCADE;


    TABLE "items" CONSTRAINT "items_cat_id_fkey" FOREIGN KEY (cat_id) REFERENCES categories(category_id)


