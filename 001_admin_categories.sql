CREATE TABLE IF NOT EXISTS public.users
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    username text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    role text COLLATE pg_catalog."default" DEFAULT 'user'::text,
    account_type text COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    avatar text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    state text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
)
TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.user_documents
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    document_name text COLLATE pg_catalog."default" NOT NULL,
    document_url text COLLATE pg_catalog."default" NOT NULL,
    document_type text COLLATE pg_catalog."default",
    file_size integer,
    uploaded_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_documents_pkey PRIMARY KEY (id),
    CONSTRAINT user_documents_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_documents
    OWNER to postgres;
-- Index: idx_user_documents_user

-- DROP INDEX IF EXISTS public.idx_user_documents_user;

CREATE INDEX IF NOT EXISTS idx_user_documents_user
    ON public.user_documents USING btree
    (user_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.user_category_preferences
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    category_slug text COLLATE pg_catalog."default" NOT NULL,
    subcategory_slugs jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_category_preferences_pkey PRIMARY KEY (id),
    CONSTRAINT user_category_preferences_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_category_preferences
    OWNER to postgres;


CREATE INDEX IF NOT EXISTS idx_user_category_preferences_user
    ON public.user_category_preferences USING btree
    (user_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE TABLE admin_categories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#1e40af',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subcategories table with parent relationship
CREATE TABLE admin_subcategories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  parent_category_id VARCHAR NOT NULL REFERENCES admin_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

