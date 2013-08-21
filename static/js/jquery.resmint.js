/*

SMINT V1.0 by Robert McCracken
SMINT V2.0 by robert McCracken with some awesome help from Ryan Clarke (@clarkieryan) and mcpacosy ‏(@mcpacosy)
http://www.outyear.co.uk/smint/

RESMINT V1.0 - A Responsive Smint by Frank Yin
frank@warewoof.com

*/


(function(){		
	var $doc = $(document),
        $win = $(window),
		optionLocs = new Array(),
		scrollSpeed = 500,
		lastScrollTop = 0,
		menuHeight = 0,	
		stickyTop = 0,
		scrollTop = 0
		currentlyMobile = false;
		
	function isMobileSize() {
		return $win.width() < 960 ? true : false;
	}

	function setMenuDisplay() {
		var prevHeight = 0;
		
		menuHeight = $(".navContainer").height();
			
		$('.navContainer a').each( function(index) {
			//Fill the menu
			var id = $(this).attr("id");
								
			optionLocs.push(Array(prevHeight, $("div."+id).height()+$("div."+id).position().top-menuHeight, id));
			prevHeight = $("div."+id).height()+$("div."+id).position().top-menuHeight;
			//console.log('index[0]:'+optionLocs[index][0]+' index[1]:'+ optionLocs[index][1] + ' id:'+id);
			// get initial top offset for the menu 
			stickyTop = $('.navContainer').offset().top;	
		});
	
	}
	
	function navClick(e) {
		
		e.preventDefault(); 
		
		// get id of the button you just clicked
		var id = e.target.id;	
		
		
		if (!$('div.'+id).length) { return }	// in case element doesn't exist
		
		var goTo =  $('div.'+ id).offset().top - menuHeight + 1;

		//console.log('goto: '+ goTo);
		// Scroll the page to the desired position!
		$("html, body").animate({ scrollTop: goTo }, scrollSpeed);
	}
	
	function navScroll(e) {
		//Get the direction of scroll
		var st = $doc.scrollTop();
		if (st > lastScrollTop) {
			direction = "down";
		} else if (st < lastScrollTop ){
			direction = "up";
		}
		lastScrollTop = st;
		
		scrollTop = $win.scrollTop(); 
		
		// if we scroll more than the navigation, change its position to fixed and add class 'fxd', otherwise change it back to absolute and remove the class
		if (scrollTop > stickyTop) { 
			$('.navContainer').css({ 'position': 'fixed', 'top':0 });	
		} else {
			$('.navContainer').removeAttr('style');
		}   

		//Check if the position is inside then change the menu
		var activeSet = false;	// flag only one button can be active
		
		$.each(optionLocs, function(index) {			
			if(optionLocs[index][0] <= scrollTop && scrollTop <= optionLocs[index][1] && !activeSet){	
				$("#"+optionLocs[index][2]).addClass("active");				
				activeSet = true;
			} else {
				$("#"+optionLocs[index][2]).removeClass("active");
			}
		});
		
		// Check if at bottom of page, if so, add class to last <a> as sometimes the last div
		// isnt long enough to scroll to the top of the page and trigger the active state.
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			$('.navContainer a').removeClass('active');
			$('.navContainer a').last().addClass('active');
		}
	}
	
	function toggleMenuPanel(e) {
		e.preventDefault(); 
		if (isMobileSize()) {
			
			if ($('.navContainer').hasClass('open')) { // menu panel is currently open, so hide all non-active items
				$(".navContainer a").each(function(i){					
					$(this).css('display','');	//by default non-active items are display:none					
				});
				$('.navContainer').removeClass('open');
				navClick(e);
			} else {								// menu panel is currently closed, so open up everything
				$(".navContainer a").each(function(i){
					$(this).css('display','block');
				});
				$('.navContainer').addClass('open');
			}	
			
		} else {
			navClick(e);
		}
	}
	
	$doc.on('ready', function () {
		
		setMenuDisplay();

		$('.navContainer').on('click', function(e){toggleMenuPanel(e)});
		
		$win.scroll(function(e) {
			navScroll(e);
		});		
	});


})();