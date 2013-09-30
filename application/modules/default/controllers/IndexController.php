<?php

class Default_IndexController extends Zend_Controller_Action {

    public function init() {
        /* Initialize action controller here */
    }

    public function indexAction() {
        $banner = new Banner();
        $this->view->banners = $banner->fetchAll('ativo <> 0');
    }

    public function historicoAction() {
        
    }

    public function missaoAction() {
        
    }

    public function objetivosAction() {
        
    }

    public function valoresAction() {
        
    }

    public function visaoAction() {
        
    }

}

