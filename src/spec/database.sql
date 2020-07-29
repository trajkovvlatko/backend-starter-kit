--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Ubuntu 12.2-4)
-- Dumped by pg_dump version 12.2 (Ubuntu 12.2-4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: performers; Type: TABLE; Schema: public; Owner: vlatko
--

CREATE TABLE public.performers (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    details text,
    website text,
    rating integer,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.performers OWNER TO vlatko;

--
-- Name: performers_id_seq; Type: SEQUENCE; Schema: public; Owner: vlatko
--

CREATE SEQUENCE public.performers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.performers_id_seq OWNER TO vlatko;

--
-- Name: performers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlatko
--

ALTER SEQUENCE public.performers_id_seq OWNED BY public.performers.id;


--
-- Name: pgmigrations; Type: TABLE; Schema: public; Owner: vlatko
--

CREATE TABLE public.pgmigrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.pgmigrations OWNER TO vlatko;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE; Schema: public; Owner: vlatko
--

CREATE SEQUENCE public.pgmigrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pgmigrations_id_seq OWNER TO vlatko;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlatko
--

ALTER SEQUENCE public.pgmigrations_id_seq OWNED BY public.pgmigrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: vlatko
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO vlatko;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: vlatko
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO vlatko;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlatko
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: performers id; Type: DEFAULT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.performers ALTER COLUMN id SET DEFAULT nextval('public.performers_id_seq'::regclass);


--
-- Name: pgmigrations id; Type: DEFAULT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.pgmigrations ALTER COLUMN id SET DEFAULT nextval('public.pgmigrations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: performers performers_pkey; Type: CONSTRAINT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.performers
    ADD CONSTRAINT performers_pkey PRIMARY KEY (id);


--
-- Name: pgmigrations pgmigrations_pkey; Type: CONSTRAINT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.pgmigrations
    ADD CONSTRAINT pgmigrations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_unique_index; Type: INDEX; Schema: public; Owner: vlatko
--

CREATE UNIQUE INDEX users_email_unique_index ON public.users USING btree (email);


--
-- Name: performers performers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vlatko
--

ALTER TABLE ONLY public.performers
    ADD CONSTRAINT "performers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

