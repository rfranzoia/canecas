-- public.product_types definition
-- Drop table
-- DROP TABLE public.product_types;
CREATE TABLE public.product_types
(
    id          bigserial    NOT NULL,
    description varchar(200) NOT NULL,
    image       varchar(200) NULL,
    CONSTRAINT product_types_pkey PRIMARY KEY (id)
);

ALTER TABLE public.product_types OWNER TO caneca;

-- public.users definition
-- Drop table
-- DROP TABLE public.users;
CREATE TABLE public.users
(
    id         bigserial    NOT NULL,
    "role"     varchar(20)  NOT NULL,
    "name"     varchar(200) NOT NULL,
    email      varchar(300) NOT NULL,
    "password" varchar(100) NULL,
    phone      varchar(20)  NULL,
    address    varchar(500) NULL,
    last_login timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

ALTER TABLE public.users OWNER TO caneca;


-- public.orders definition
-- Drop table
-- DROP TABLE public.orders;
CREATE TABLE public.orders
(
    id           uuid        NOT NULL DEFAULT uuid_generate_v4(),
    order_date   timestamptz NOT NULL DEFAULT now(),
    user_id      int8        NOT NULL,
    order_status bpchar(1)   NOT NULL DEFAULT '0'::bpchar,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES public.users (id)
);

ALTER TABLE public.orders OWNER TO caneca;


-- public.products definition
-- Drop table
-- DROP TABLE public.products;
CREATE TABLE public.products
(
    id              bigserial    NOT NULL,
    product_type_id int8         NOT NULL,
    "name"          varchar(200) NOT NULL,
    description     varchar(500) NULL,
    image           varchar(200) NULL,
    price           float8       NULL DEFAULT 0,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product_type FOREIGN KEY (product_type_id) REFERENCES public.product_types (id)
);

ALTER TABLE public.products OWNER TO caneca;


-- public.order_history definition
-- Drop table
-- DROP TABLE public.order_history;
CREATE TABLE public.order_history
(
    id              bigserial    NOT NULL,
    order_id        uuid         NOT NULL,
    change_date     timestamptz  NOT NULL DEFAULT now(),
    previous_status bpchar(1)    NULL,
    current_status  bpchar(1)    NULL,
    change_reason   varchar(300) NULL,
    CONSTRAINT order_history_pkey PRIMARY KEY (id),
    CONSTRAINT fk_order_history_order FOREIGN KEY (order_id) REFERENCES public.orders (id)
);

ALTER TABLE public.order_history OWNER TO caneca;


-- public.order_items definition
-- Drop table
-- DROP TABLE public.order_items;
CREATE TABLE public.order_items
(
    id         bigserial NOT NULL,
    order_id   uuid      NOT NULL,
    product_id int8      NOT NULL,
    quantity   numeric   NOT NULL,
    price      numeric   NOT NULL,
    discount   numeric   NOT NULL DEFAULT 0,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id) REFERENCES public.orders (id),
    CONSTRAINT fk_order_items_products FOREIGN KEY (product_id) REFERENCES public.products (id)
);

ALTER TABLE public.order_items OWNER TO caneca;


-- public.product_price_history definition
-- Drop table
-- DROP TABLE public.product_price_history;
CREATE TABLE public.product_price_history
(
    id          bigserial NOT NULL,
    product_id  int8      NOT NULL,
    price       numeric   NOT NULL DEFAULT 0,
    valid_until date      NOT NULL DEFAULT now(),
    CONSTRAINT product_prices_pkey PRIMARY KEY (id),
    CONSTRAINT product_prices_product FOREIGN KEY (product_id) REFERENCES public.products (id)
);

ALTER TABLE public.product_price_history OWNER TO caneca;