<?php

class Default_IndexController extends Zend_Controller_Action {

    public function init() {
        /* Initialize action controller here */
    }

    public function indexAction() {
        $banner = new Banner();
        $this->view->banners = $banner->fetchAll('ativo <> 0');

        $noticia = new Noticia();
        $this->view->noticias = $noticia->getLastOffset(2);
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

    public function contatoAction() {
        if ($this->getRequest()->isPost()) {

            $dados = $this->getRequest()->getPost();

            $to = 'emersonrodrigod@gmail.com';
            $subject = 'Contato Site IVB';

            $message = $dados['nome'] . ' - ' . $dados['telefone'] . '<br/>' . $dados['mensagem'];


            $headers = "From: " . $dados['email'] . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

            if(mail($to, $subject, $message, $headers)){
                $this->_helper->flashMessenger(array('success' => 'E-mail enviado com sucesso!'));
                $this->_redirect('/contato');
            }
        }
    }

}

