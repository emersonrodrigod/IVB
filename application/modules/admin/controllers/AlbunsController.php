<?php

class Admin_AlbunsController extends Zend_Controller_Action {

    public function indexAction() {
        $album = new Album();
        $this->view->albuns = $album->fetchAll();
    }

    public function addAction() {
        if ($this->_request->isPost()) {
            $album = new Album();
            $dados = $this->_request->getPost();
            try {

                $dados['id_usuario'] = 1;
                $album->insert($dados);
                $this->_helper->flashMessenger(array('success' => 'Cadastro realizado com sucesso!'));
                $this->_redirect("/admin/albuns");
            } catch (Zend_Db_Exception $exc) {

                if ($exc->getCode() == 23000) {
                    $msg = 'Violação de Chave Estrangeira';
                } else {
                    $msg = $exc->getMessage();
                }

                $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $msg));
            }
        }
    }

    public function editAction() {
        $album = new Album();
        $this->view->album = $album->find($this->_getParam('id'))->current();

        if ($this->_request->isPost()) {
            $dados = $this->_request->getPost();
            try {

                $dados['id_usuario'] = 1;
                $album->update($dados, 'id = ' . $this->_getParam('id'));
                $this->_helper->flashMessenger(array('success' => 'Alteração realizada com sucesso!'));
                $this->_redirect("/admin/albuns");
            } catch (Zend_Db_Exception $exc) {

                if ($exc->getCode() == 23000) {
                    $msg = 'Violação de Chave Estrangeira';
                } else {
                    $msg = $exc->getMessage();
                }

                $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $msg));
            }
        }
    }

    public function fotosAction() {
        $album = new Album();
        $this->view->album = $album->find($this->_getParam('id'))->current();
    }

    /*
     * Action responsável por fazer o upload das imagens do album
     * por uma requisição ajax.
     * 
     * @return json_encode
     */

    public function addFotoAction() {
        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();
        $adapter = new Zend_File_Transfer_Adapter_Http();

        $adapter->setDestination('albuns/img');
        $adapter->addValidator('Extension', false, 'jpg,png,gif');

        $files = $adapter->getFileInfo();
        $post = $this->_request->getPost();

        /*
         * Itera os arquivos enviados e trata cada um deles
         * criando o thumbnail e armazenando as informações
         * no banco de dados.
         */
        foreach ($files as $file => $info) {
            if ($adapter->isValid($file)) {

                $adapter->receive($file);

                if ($adapter->isReceived($file)) {

                    $nome = $this->renomearArquivo($info);

                    $data = array(
                        'caminho' => $info['destination'] . "/" . $nome,
                        'thumb' => 'albuns/thumbs/' . $nome,
                        'id_album' => $post['idAlbum']
                    );

                    $this->insereDadosFotos($data);

                    $canvas = new Canvas($info['destination'] . '/' . $nome);
                    $canvas->redimensiona(150, 100);
                    $canvas->grava('albuns/thumbs/' . $nome);

                    $msg[] = array('status' => 'success', 'filename' => $info['name']);
                }
            } else {
                $msg[] = array('status' => 'error', 'msgerror' => "Erro ao mover arquivo");
            }
        }
    }

    /*
     * Renomeia o arquivo recebido com um uniqid com hash md5
     * para evitar que arquivos com o mesmo nome sejam 
     * substituidos.
     * 
     * @return O nome do arquivo
     */

    private function renomearArquivo($file) {
        $explode = explode(".", $file['name']);
        $end = end($explode);

        $nome = md5(uniqid()) . '.' . strtolower($end);

        $filePath = $file['destination'];

        $filterFileRename = new Zend_Filter_File_Rename(array('target' => $filePath . '/' . $nome, 'overwrite' => true));
        $filterFileRename->filter($filePath . '/' . $file['name']);

        return $nome;
    }

    /*
     * Insere as informações das fotos do album no banco de dados.
     * Caso ocorra alguma falha lança uma exceção
     */

    private function insereDadosFotos($dados) {

        $fotos = new AlbumFotos();

        try {

            $fotos->insert($dados);
        } catch (Zend_Db_Exception $exc) {

            $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $exc->getMessage()));
        }

        $album = new Album();
        $atual = $album->find($dados['id_album'])->current();

        $foto = $atual->findDependentRowset('Albumfotos')->toArray();
        $data['imagemCapa'] = $foto[0]['thumb'];

        $album->update($data, 'id = ' . $dados['id_album']);
    }

    /*
     * Recupera as informações do album pelo id passado
     * como parametro e lista as fotos deste album
     * por uma requisição ajax.
     */

    public function listaFotosAction() {

        $this->_helper->layout()->disableLayout();

        $album = new Album();
        $atual = $album->find($this->_getParam('id'))->current();

        $fotos = $atual->findDependentRowset('AlbumFotos');
        $this->view->fotos = $fotos;
    }

    /*
     * Remove as fotos de um album através
     * de uma requisição ajax
     */

    public function removeFotoAction() {
        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();

        $foto = new AlbumFotos();
        $atual = $foto->find(intval($this->_getParam('id')))->current();

        unlink($atual->caminho);
        unlink($atual->thumb);

        $atual->delete();

        $album = new Album();
        $a = $album->find($this->_getParam('album'))->current();

        $f = $a->findDependentRowset('Albumfotos')->toArray();
        $data['imagemCapa'] = (empty($f) ? null : $f[0]['thumb']);

        $album->update($data, 'id = ' . $this->_getParam('album'));
    }

    /*
     * Remove um album e todas as suas fotos do banco de dados
     * também remove os arquivos de imagem nas pastas correspondentes
     */

    public function removeAlbumAction() {
        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();

        $album = new Album();
        $atual = $album->find(intval($this->_getParam('id')))->current();

        $fotos = $atual->findDependentRowset('AlbumFotos');

        $albumFotos = new AlbumFotos();

        /*
         * Remove todas as fotos primeiramente
         */
        foreach ($fotos as $foto) {
            $fotoAtual = $albumFotos->find($foto->id)->current();
            unlink($foto->caminho);
            unlink($foto->thumb);
            $fotoAtual->delete();
        }

        $atual->delete();
        $this->_redirect('/admin/albuns');
    }

}

