<?php

class Noticia extends Zend_Db_Table_Abstract {

    protected $_name = 'noticia';

    public function getLastOffset($offset) {

        $select = $this->select()->limit($offset)->order('id desc');
        return $this->fetchAll($select);
    }

}
