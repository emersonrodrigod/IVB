<?php

class Default_NoticiasController extends Zend_Controller_Action {

    public function singleAction() {

        $noticia = new Noticia();
        $atual = $noticia->find(intval($this->_getParam('id')))->current();
        $this->view->noticia = $atual;
    }

    public function indexAction() {
        $noticia = new Noticia();
        $this->view->noticias = $noticia->fetchAll('1 = 1', 'id desc');
    }

}