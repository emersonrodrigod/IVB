<?php

class Album extends Zend_Db_Table_Abstract {

    protected $_name = 'album';
    protected $_dependentTables = array('AlbumFotos');
    protected $_referenceMap = array(
        'Usuario' => array(
            'columns' => 'id',
            'refTableClass' => 'Usuario',
            'refColumns' => 'id_usuario'
        )
    );

}