function checkAll()
{
	$(".alert").click(function()
	{
		var tocheck = $(this).find('input');

		if(tocheck.is(':checked'))
		{
			//$(this).find('input').prop('checked', true);
			tocheck.prop('checked', false);
			$(this).attr('class', 'alert alert-danger');
		}else
		{
			tocheck.prop('checked', true);
			$(this).attr('class', 'alert alert-success');
		}
	});
}