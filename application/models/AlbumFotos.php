<?php

class AlbumFotos extends Zend_Db_Table_Abstract {

    protected $_name = 'album_fotos';
    protected $_referenceMap = array(
        'Album' => array(
            'columns' => 'id_album',
            'refTableClass' => 'Album',
            'refColumns' => 'id'
        )
    );

}
