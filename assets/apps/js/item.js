$(function () {

    var $table = $('#item');
    var $modal = $('#my_modal');

    $('li.settings').addClass('opened active').find('ul').addClass('visible').find('li.items').addClass('active');

    $table.DataTable({
        LengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        autoWidth: false,
        responsive: false,
        processing: true,
        serverSide: true,
        info:     false,
        bLengthChange: false,
        ordering: false,
        fnInitComplete: function(){
           $('.dataTables_filter').append($('#add').clone());
         },
        ajax: {
            url: base_url + 'admin/item/all',
            type: 'POST'
        },
        columns: [
            {data: 'id', visible:false},
            {data: 'actions',  width: '1%', orderable: false, searchable: false},
            {data: 'khmer'},
            {data: 'latin'},
            {data: 'item_type',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol){
                    (oData.item_type == '1')? $(nTd).html('Item') : '';
                    (oData.item_type == '2')? $(nTd).html('Service') : '';
                }
            },
            {data: 'category_id'},
            {data: 'description'}
        ],
        order: [[ 0, "desc" ]]
    });


    $table.closest('.dataTables_wrapper').find('select').select2({
        minimumResultsForSearch: -1
    });

    $modal.on('show.bs.modal', function() {
        $(this).find('select').select2({
            dropdownParent: $(this)
        });
        $(this).find('input[name="category_id"]').select2({
            minimumInputLength: 2,
            ajax: {
                url: base_url + 'admin/category/select2',
                type: 'POST',
                dataType: 'json',
                quietMillis: 250,
                data: function (term) {
                    return {
                        search: term
                    };
                },
                results: function (data, page) {
                    return {
                        results: data.items
                    };
                },
                cache: false
            }
        });
        if ($(this).find('#category_id').data('id')!==0) {
        $(this).find('input[name="category_id"]').select2("data", {id: $(this).find('#category_id').data('id'), text: $(this).find('#category_id').data('text')});
        }

        $(this).find('input[type=checkbox]').iCheck({
            checkboxClass: 'icheckbox_square-blue'
        });

    });

    $table.on('click', '.remove', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        if (confirm("Are you sure?")) {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    (response.status == '1') ? $table.DataTable().ajax.reload() : '';
                }
            });
        }
    });
    
    $table.on('click', '.edit', function(e) {
        e.preventDefault();
        $.ajax({
            url: $(this).attr('href'),
            type: 'GET',
            dataType: 'html',
            success: function(html) {
                $modal.find('.modal-title').html('Update');
                $modal.find('.modal-body').html(html);
                $modal.find('#click_submit').html('<i class="fa fa-save"></i>&nbsp; Update');
                $modal.modal('show');
            }
        });
    });

    $('.main-content').on('click', "a[rel='add']", function(event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('href'),
            type: 'GET',
            dataType: 'html',
            success: function(html) {
                $modal.find('.modal-title').html('Add New');
                $modal.find('.modal-body').html(html);
                $modal.find('#click_submit').html('<i class="fa fa-save"></i>&nbsp; Save');
                $modal.modal('show');
            }
        });
    });

    function createUpdate() {
        $.ajax({
            url: $('#form_item').attr('action'),
            type: 'POST',
            dataType: 'json',
            data: new FormData($('#form_item')[0]),
            processData: false,
            contentType: false,
            success: function(response) {
                if(response.status == '1'){
                    $modal.modal('hide');
                    $table.DataTable().ajax.reload();
                }
            }
        });
    }

    $modal.on('click', '#click_submit', function(event) {
        event.preventDefault();
        createUpdate();
    });
    
});