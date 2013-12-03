create table noticia(
    id int not null auto_increment primary key,
    titulo varchar(200) not null,
    texto text not null
    
);

alter table noticia add dataPostagem timestamp not null default current_timestamp;