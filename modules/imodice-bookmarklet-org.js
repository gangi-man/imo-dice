
function(){
    if (typeof(__imo_dice_disp__)==='undefined'){
	let s=document.createElement('script');
	s.src='$$$URL$$$';
	s.onload=function(){
	    __imo_dice_disp__=__imo_dice__().rpg_dice_display();
	    __imo_dice_disp__.show();
	};
	document.body.appendChild(s);
    } else {
	__imo_dice_disp__.show();
    }
}
