<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<form role="form" class="form-horizontal" id="form_type" action="<?php echo base_url(); ?>admin/type/edit/<?php echo $type->id; ?>" method="post">
    <?php require_once 'form.php'; ?>
</form>