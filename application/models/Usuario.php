<?php

class Usuario extends Zend_Db_Table_Abstract {

    protected $_name = 'usuario';
    protected $_dependentTables = array('Album');

    public function getByEmail($email) {
        return $this->fetchRow("email = '{$email}'");
    }

}
