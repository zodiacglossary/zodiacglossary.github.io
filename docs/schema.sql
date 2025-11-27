--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6 (Debian 14.6-1.pgdg110+1)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: Kierán's query for mistyped page numbers; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."Kierán's query for mistyped page numbers" AS
SELECT
    NULL::integer AS lemma_id,
    NULL::character varying AS original,
    NULL::character varying AS translation;


--
-- Name: cross_link_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cross_link_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cross_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cross_links (
    cross_link_id integer DEFAULT nextval('public.cross_link_id_seq'::regclass),
    lemma_id integer,
    link integer
);


--
-- Name: edit_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edit_history (
    id integer NOT NULL,
    lemma_id integer NOT NULL,
    username character varying DEFAULT ''::character varying NOT NULL,
    "timestamp" timestamp with time zone NOT NULL
);


--
-- Name: edit_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.edit_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edit_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.edit_history_id_seq OWNED BY public.edit_history.id;


--
-- Name: external_link_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.external_link_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: external_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_links (
    external_link_id integer DEFAULT nextval('public.external_link_id_seq'::regclass),
    url character varying,
    display character varying,
    lemma_id integer
);


--
-- Name: todo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.todo (
    id integer NOT NULL,
    item character varying DEFAULT ''::character varying,
    complete boolean DEFAULT false NOT NULL,
    date_added timestamp with time zone DEFAULT now(),
    added_by integer DEFAULT 29
);


--
-- Name: COLUMN todo.added_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.todo.added_by IS 'User id of the person who added the todo list item';


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying DEFAULT ''::character varying NOT NULL,
    last_name character varying DEFAULT ''::character varying NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    username character varying DEFAULT ''::character varying NOT NULL,
    password character varying DEFAULT ''::character varying NOT NULL,
    active boolean DEFAULT false NOT NULL,
    website character varying DEFAULT ''::character varying
);


--
-- Name: incomplete_todo_list_items; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.incomplete_todo_list_items AS
 SELECT todo.id,
    todo.item,
    todo.complete,
    todo.date_added,
    todo.added_by,
    ( SELECT users.username
           FROM public.users
          WHERE (users.id = todo.added_by)) AS username
   FROM public.todo
  WHERE (todo.complete = false)
  ORDER BY todo.date_added DESC;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.languages (
    language_id integer NOT NULL,
    label character varying(63),
    active boolean DEFAULT false,
    value character varying
);


--
-- Name: languages_language_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.languages_language_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: languages_language_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.languages_language_id_seq OWNED BY public.languages.language_id;


--
-- Name: lemmata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lemmata (
    lemma_id integer NOT NULL,
    published boolean DEFAULT false NOT NULL,
    original character varying DEFAULT ''::character varying,
    translation character varying DEFAULT ''::character varying,
    transliteration character varying DEFAULT ''::character varying,
    partofspeech_id integer DEFAULT 0 NOT NULL,
    language_id integer DEFAULT 0 NOT NULL,
    primary_meaning character varying DEFAULT ''::character varying,
    editor character varying DEFAULT ''::character varying,
    literal_translation2 character varying DEFAULT ''::character varying,
    last_edit timestamp with time zone,
    comment character varying DEFAULT ''::character varying NOT NULL,
    checked boolean DEFAULT false NOT NULL,
    attention boolean DEFAULT false,
    loan_language_id integer DEFAULT 0,
    loan_type character varying DEFAULT 'none'::character varying
);


--
-- Name: lemmata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lemmata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lemmata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lemmata_id_seq OWNED BY public.lemmata.lemma_id;


--
-- Name: meaning_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meaning_categories (
    category_id integer NOT NULL,
    meaning_id integer NOT NULL,
    category character varying DEFAULT ''::character varying
);


--
-- Name: meaning_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meaning_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meaning_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meaning_categories_id_seq OWNED BY public.meaning_categories.category_id;


--
-- Name: meanings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meanings (
    meaning_id integer NOT NULL,
    value character varying DEFAULT ''::character varying,
    lemma_id integer NOT NULL,
    category character varying DEFAULT ''::character varying,
    comment character varying DEFAULT ''::character varying
);


--
-- Name: meanings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meanings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meanings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meanings_id_seq OWNED BY public.meanings.meaning_id;


--
-- Name: partsofspeech; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partsofspeech (
    partofspeech_id integer NOT NULL,
    label character varying(63) DEFAULT ''::character varying,
    active boolean DEFAULT true,
    value character varying(63) DEFAULT ''::character varying
);


--
-- Name: partsofspeech_partofspeech_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partsofspeech_partofspeech_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partsofspeech_partofspeech_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partsofspeech_partofspeech_id_seq OWNED BY public.partsofspeech.partofspeech_id;


--
-- Name: quotation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quotation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quotations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotations (
    quotation_id integer DEFAULT nextval('public.quotation_id_seq'::regclass),
    original character varying DEFAULT ''::character varying,
    transliteration character varying DEFAULT ''::character varying,
    lemma_id integer,
    translation character varying DEFAULT ''::character varying,
    source character varying DEFAULT ''::character varying,
    genre character varying DEFAULT ''::character varying,
    provenance character varying DEFAULT ''::character varying,
    date character varying DEFAULT ''::character varying,
    publication character varying DEFAULT ''::character varying,
    link character varying DEFAULT ''::character varying,
    line character varying DEFAULT ''::character varying,
    meaning_id integer,
    page character varying DEFAULT ''::character varying,
    comment character varying DEFAULT ''::character varying
);


--
-- Name: todo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.todo_id_seq OWNED BY public.todo.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variants (
    variant_id integer NOT NULL,
    original character varying DEFAULT ''::character varying,
    transliteration character varying DEFAULT ''::character varying,
    lemma_id integer,
    comment character varying DEFAULT ''::character varying
);


--
-- Name: variants_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.variants_variant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: variants_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.variants_variant_id_seq OWNED BY public.variants.variant_id;


--
-- Name: edit_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edit_history ALTER COLUMN id SET DEFAULT nextval('public.edit_history_id_seq'::regclass);


--
-- Name: languages language_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages ALTER COLUMN language_id SET DEFAULT nextval('public.languages_language_id_seq'::regclass);


--
-- Name: lemmata lemma_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lemmata ALTER COLUMN lemma_id SET DEFAULT nextval('public.lemmata_id_seq'::regclass);


--
-- Name: meaning_categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meaning_categories ALTER COLUMN category_id SET DEFAULT nextval('public.meaning_categories_id_seq'::regclass);


--
-- Name: meanings meaning_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meanings ALTER COLUMN meaning_id SET DEFAULT nextval('public.meanings_id_seq'::regclass);


--
-- Name: partsofspeech partofspeech_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partsofspeech ALTER COLUMN partofspeech_id SET DEFAULT nextval('public.partsofspeech_partofspeech_id_seq'::regclass);


--
-- Name: todo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todo ALTER COLUMN id SET DEFAULT nextval('public.todo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: variants variant_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants ALTER COLUMN variant_id SET DEFAULT nextval('public.variants_variant_id_seq'::regclass);


--
-- Name: edit_history edit_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edit_history
    ADD CONSTRAINT edit_history_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (language_id);


--
-- Name: lemmata lemmata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lemmata
    ADD CONSTRAINT lemmata_pkey PRIMARY KEY (lemma_id);


--
-- Name: meaning_categories meaning_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meaning_categories
    ADD CONSTRAINT meaning_categories_pkey PRIMARY KEY (category_id);


--
-- Name: meanings meanings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meanings
    ADD CONSTRAINT meanings_pkey PRIMARY KEY (meaning_id);


--
-- Name: partsofspeech partsofspeech_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partsofspeech
    ADD CONSTRAINT partsofspeech_pkey PRIMARY KEY (partofspeech_id);


--
-- Name: todo todo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todo
    ADD CONSTRAINT todo_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey1 PRIMARY KEY (id);


--
-- Name: variants variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_pkey PRIMARY KEY (variant_id);


--
-- Name: Kierán's query for mistyped page numbers _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public."Kierán's query for mistyped page numbers" AS
 SELECT l.lemma_id,
    l.original,
    l.translation
   FROM (public.lemmata l
     JOIN public.quotations USING (lemma_id))
  WHERE ((l.language_id = 6) AND ((quotations.page)::text !~~ '%.%'::text))
  GROUP BY l.lemma_id
  ORDER BY l.lemma_id;


--
-- Name: cross_links cross_links_lemma_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cross_links
    ADD CONSTRAINT cross_links_lemma_id_fkey FOREIGN KEY (lemma_id) REFERENCES public.lemmata(lemma_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lemmata lemmata_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lemmata
    ADD CONSTRAINT lemmata_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(language_id);


--
-- Name: lemmata lemmata_partofspeech_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lemmata
    ADD CONSTRAINT lemmata_partofspeech_fkey1 FOREIGN KEY (partofspeech_id) REFERENCES public.partsofspeech(partofspeech_id);


--
-- Name: meanings meanings_lemma_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meanings
    ADD CONSTRAINT meanings_lemma_id_fkey FOREIGN KEY (lemma_id) REFERENCES public.lemmata(lemma_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: meanings meanings_lemma_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meanings
    ADD CONSTRAINT meanings_lemma_id_fkey1 FOREIGN KEY (lemma_id) REFERENCES public.lemmata(lemma_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quotations quotations_lemma_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_lemma_id_fkey1 FOREIGN KEY (lemma_id) REFERENCES public.lemmata(lemma_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: variants variants_lemma_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_lemma_id_fkey FOREIGN KEY (lemma_id) REFERENCES public.lemmata(lemma_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: variants variants_lemma_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_lemma_id_fkey1 FOREIGN KEY (lemma_id) REFERENCES public.lemmata(lemma_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

