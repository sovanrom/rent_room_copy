<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Price_model extends MY_Model {

	protected $table = 'prices';

	public function __construct()
	{
		parent::__construct();
	}

	public function all($user = '')
	{
		$this->load->library('datatables');
		$this->datatables->select('id')
		->select('price')
		->select('description')
		->from($this->table)
		->where('status', 1);

		($user != '') ? $this->datatables->where('created_by', $user) : '' ;

		$edit = "<a href='" . base_url('admin/price/edit/$1') . "' class='edit' title='edit'><i class='entypo-pencil'></i></a>";
		$actions = $edit;

		$this->datatables->add_column(
			"actions",
			"<div class='text-center'>
				<div class='btn-group'>$actions</div>
			</div>",
			"id"
		);
		$this->datatables->unset_column('id');
		return $this->datatables->generate();
	}

}