/* ==========================================================
 * Ministrap 0.2
 * http://mangolight.github.com/ministrap
 * ==========================================================
 * Copyright 2013 MangoLight / http://www.mangolight.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
;(function($){

	"use strict";

	$(function(){

		$(document).ready(function(){
			
			/* ----- TABS ----- */
			$('.tabs').miniTabs();
			/* --------------- */
			
			/* ----- NAV ----- */
			$('.nav').each(function(){
				var offset_top = parseInt($('body').css('padding-top'))+15;
				if($(this).attr('data-offset-top')) offset_top=parseInt($(this).attr('data-offset-top'));
				$(this).miniNav({
					offset_top: offset_top
				});
			});
			/* --------------- */
			
			/* ----- DROPDOWNS ----- */
			$('a[data-dropdown],select.dropdown').each(function(){
				var scroll=$(this).attr('data-scroll');
				if(scroll){(scroll=="true"?scroll=true:scroll=false)}
				var columns=$(this).attr('data-columns');
				if(columns) columns=parseInt(columns);
				$(this).miniDropdown({
					width: $(this).attr('data-width'),
					scroll: scroll,
					columns: columns
				});
			});
			/* --------------- */
			
			/* ----- CAROUSEL ----- */
			$('.carousel').miniCarousel();
			/* --------------- */
			
			/* ----- TO TOP ----- */
			$('.to-top').miniToTop();
			/* --------------- */
			
			/* ----- MODAL ----- */
			$('[data-modal]').miniModal();
			/* --------------- */
			
			/* ----- HINTS ----- */
			$('[data-hint]').miniHint();
			/* --------------- */
			
			/* ----- MOBILE MENU ----- */
			$('body').miniMobileMenu();
			/* --------------- */
		});

	})

})(jQuery);



/*
* MiniModal
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniModal = function(options){
		
		var settings = $.extend({
			background: true // display background
		}, options);
		
		return this.not('.miniModal').each(function(){
            $(this).addClass('miniModal');
			var link = $(this);
			var modal = link.attr('data-modal');
            var modal_bg = $('<div>').addClass('modal-bg').appendTo('body');
			if(modal.indexOf('#')==0 || modal.indexOf('.')==0){
				modal = $(modal).appendTo('body');
				if(modal.length>0){
					prepareModal(modal,modal_bg);
					link.click(function(){
						modal.trigger('open');
						return false;
					});
                    modal.bind('close',function(){ closeModal(modal,modal_bg); });
                    modal.find('.close').click(function(){ closeModal(modal,modal_bg); });
				}
			}else{
                link.click(function(){
					$.ajax({
						url:link.attr('href'),
						success:function(data){
                            var modal_div = $('<div>').addClass('modal ajax').appendTo('body');
							if(link.attr('data-title')!='') $('<div>').addClass('modal-title').html('<h5>'+link.attr('data-title')+'</h5> <div class="close">&times;</div>').appendTo(modal_div);
							$('<div>').addClass('modal-content').html(data).appendTo(modal_div);
                            prepareModal(modal_div,modal_bg);
                            modal_div.trigger('open');
                            modal_div.bind('close',function(){ closeModal(modal_div,modal_bg); });
                            modal_div.find('.close').click(function(){ closeModal(modal_div,modal_bg); });
						}
					});
                    return false;
				});
			}
		});
        
        function prepareModal(modal,modal_bg){
            modal.bind('open',function(){
                modal.addClass('opened');
				modal_bg.stop().fadeIn('fast',function(){
					modal.css({'position':'fixed','top':0,'left':($(window).width()/2-modal.width()/2),'opacity':0}).show().stop().animate({'top':70,'opacity':1},function(){
    				    adaptSize(modal);
					});
				}).click(function(){
					closeModal(modal,modal_bg);
				});
			});
            $(window).resize(function(){
                modal.css({'left':($(window).width()/2-modal.width()/2)});
                adaptSize(modal);
            });
            $('body').keyup(function(e){
				if(e.keyCode==27 && modal.is($('.modal.opened').last())){
					closeModal(modal,modal_bg);
				}
			});
        }
		
		function closeModal(modal,modal_bg){
            modal.stop().animate({'top':-50,'opacity':0},'fast',function(){
				$(this).hide();
                var ajax=false;
                if($(this).hasClass('ajax')){
                    ajax=true;
                    $(this).remove();
                }
                modal_bg.stop().fadeOut('fast');
			});
		}
        
        function adaptSize(modal){
            if(modal.attr('data-fixed-top')===undefined) modal.attr('data-fixed-top',parseInt(modal.css('top')));
            if((modal.height()+parseInt(modal.attr('data-fixed-top')))>$(window).height()){
                modal.css({'position':'absolute','top':($(window).scrollTop()+parseInt(modal.attr('data-fixed-top')))});
            }else{
                modal.css({'position':'fixed','top':parseInt(modal.attr('data-fixed-top'))});
            }
        }
	}
})(jQuery);


/*
* MiniCarousel
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniCarousel = function(options){
		
		var settings = $.extend({
			arrows: true, // display arrows
			indicators: true, // display indicators
			auto: true, // slide automatically
			delay: 5000 // automatic slide delay
		}, options);
		
		return this.each(function(){
			var slider = $(this);
			var slider_ul = $(this).find('ul').eq(0);
			var slider_li = $(this).find('ul li');
			slider_ul.css({'width':'999999px'});
			adaptSize(slider_li,slider);
			
			if(settings.arrows){
				var left_btn = $('<div>').html('&lsaquo;').addClass('carousel-control left').appendTo(slider).click(function(){ slider.trigger('slidePrev'); });
				var right_btn = $('<div>').html('&rsaquo;').addClass('carousel-control right').appendTo(slider).click(function(){ slider.trigger('slideNext'); });
			}
			if(settings.indicators){
				var indicators = $('<div>').addClass('carousel-indicators').appendTo(slider);
				for(var i=0;i<slider_li.length;i++){
					var indicator = $('<div>').click(function(){ slider.trigger('slideTo',$(this).attr('data-slide')); }).appendTo(indicators).attr('data-slide',i);
				}
				updateIndicators(slider,0);
			}
			if(settings.auto){
				var timer = window.setInterval(function(){ if(!slider.hasClass('hover')){slider.trigger('slideNext');} },settings.delay);
				slider.hover(function(){
					slider.addClass('hover');
                    clearInterval(timer);
				},function(){
					slider.removeClass('hover');
                    timer = window.setInterval(function(){ if(!slider.hasClass('hover')){slider.trigger('slideNext');} },settings.delay);
				});
			}
			
			$(window).resize(function(){
				adaptSize(slider_li,slider);
				slider_ul.stop().css({'margin-left':0});
				if(settings.indicators){
					updateIndicators(slider,0);
				}
			});
			
			//Use: $('.carousel').trigger('slideTo',2);
			slider.bind('slideTo',function(event,slide){
				if(slider.find('ul li').eq(slide).length>0 && slide>=0){
					slider_ul.animate({'margin-left':slide*-1*slider.width()},function(){
						if(settings.indicators){
							updateIndicators(slider,slide);
						}
					});
				}
			});
			
			//Use: $('.carousel').trigger('slidePrev');
			slider.bind('slidePrev',function(){
				var slide = parseInt((parseInt(slider.find('ul').css('margin-left').replace('px'))*(-1))/slider.width());
				var nb_slide = slider.find('li').length;
				if(slide===0) slide = nb_slide-1; else slide--;
				slider.trigger('slideTo',slide);
			});
			
			//Use: $('.carousel').trigger('slideNext');
			slider.bind('slideNext',function(){
				var slide = parseInt((parseInt(slider.find('ul').css('margin-left').replace('px'))*(-1))/slider.width());
				var nb_slide = slider.find('li').length;
				if(slide==nb_slide-1) slide=0; else slide++;
				slider.trigger('slideTo',slide);
			});
			
		});
		
		function updateIndicators(slider,slide){
			slider.find('.carousel-indicators div').removeClass('active');
			slider.find('.carousel-indicators div').eq(slide).addClass('active');
		}
		
		function adaptSize(slider_li,slider){
			slider_li.each(function(){
				$(this).css({'width':slider.width()});
			});
		}
	}
})(jQuery);


/*
* MiniToTop
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniToTop = function(){
		return this.each(function(){
			var btn = $(this);
			btn.html('&uarr;').hide().click(function(){
				$('html,body').stop().animate({'scrollTop':0},300);
			});
			$(document).scroll(function(){
				refreshBtn(btn);
			});
			$(window).resize(function(){
				refreshBtn(btn);
			});
			refreshBtn(btn);
		});
		
		function refreshBtn(btn){
			if($(document).scrollTop()>$(window).height()*1.5){
				btn.stop().show().animate({'opacity':0.75});
			}else{
				btn.stop().animate({'opacity':0},function(){$(this).hide()});
			}
		}
	}
})(jQuery);


/*
* MiniTabs
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniTabs = function(options){
		
		return this.each(function(){
			var tabs = $(this);
			
			tabs.show();
			tabs.next('.tabs-content').children().hide();
			
			tabs.find('li a').click(function(){
				try{
					$(tabs.find('li.active a').attr('href')).hide();
				}catch(e){}
				tabs.find('li.active').removeClass('active');
				$(this).parent().addClass('active');
				showActiveTab(tabs);
				return false;
			});
			
			tabs.find('li').click(function(){
				$(this).find('a').click();
				return false;
			});
			showActiveTab(tabs);
		});
			
		function showActiveTab(tabs){
			try{
				$(tabs.find('li.active a').attr('href')).show();
			}catch(e){}
		}
	}
})(jQuery);


/*
* MiniNav
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniNav = function(options){
	
		var settings = $.extend({
			offset_top: 15 // space between top and nav during scroll
		}, options);
		
		return this.each(function(){
			var obj = $(this);
			$(window).scroll(function(){
				positionNav(obj);
				updateNav(obj);
			});
			$(window).resize(function(){
				positionNav(obj);
				updateNav(obj);
			});
			positionNav(obj);
		});
			
		// Update the active link depending of the scroll position
		function updateNav(obj){
			var last = null;
			obj.find('li a').each(function(){
				try{
					if($($(this).attr('href')).offset().top<=($(document).scrollTop()+100)){
						last = $(this);
					}
				}catch(e){}
			});
			if(!last) last=obj.find('li a').eq(0);
			obj.find('li.active').removeClass('active');
			last.parent().addClass('active');
		}
		
		function positionNav(obj){
			initNav(obj);
			if($(window).width()>=680){
				fixNav(obj);
				setTopNav(obj);
			}
		}
		
		function setTopNav(obj){
			if($(document).scrollTop()<parseInt(obj.attr('data-top'))-settings.offset_top){
				obj.css({'top':parseInt(obj.attr('data-top'))-$(document).scrollTop()});
			}else{
				var end;
				try{
					end = $(obj.attr('data-fixed-end')).offset().top+$(obj.attr('data-fixed-end')).height();
				}catch(e){}
				if($(document).scrollTop()+obj.height()+settings.offset_top+parseInt(obj.css('margin-bottom'))>end){
					obj.css({'top':end-$(document).scrollTop()-obj.height()-parseInt(obj.css('margin-bottom'))});
				}else{
					obj.css({'top':settings.offset_top});
				}
			}
		}
		
		function fixNav(obj){
			obj.attr('data-top',obj.offset().top-parseInt(obj.css('margin-top'))).css({'position':'fixed','top':obj.offset().top,'width':obj.width(),'height':obj.height()}).addClass('fixed-done');
		}
		
		function initNav(obj){
			obj.css({'position':'static','top':'auto','width':'auto','height':'auto'}).removeClass('fixed-done');
		}
	}
})(jQuery);


/*
* MiniDropdown
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniDropdown = function(options){
		
		return this.each(function(){
			var obj = $(this);
			
			if(obj.is('select')){
				
				var settings = $.extend({
					onOpen: function(){}, // When opens a dropdown, returns the dropdown
					onClose: function(){}, // When close a dropdown, returns the dropdown
					width: 'parent', // Width of the dropdown (null:'auto' | 'parent' | 600)
					scroll: true, // Display a scrollbar on the item list
					columns: 3
				}, options);
				
				var id = (new Date()).getTime()+parseInt(Math.random(99999999)*999999999);
				var dropdown = $('<ul>').addClass('dropdown').insertAfter('body').attr('id','dropdown_'+id);
				$(this).find('option').each(function(){
					var li = $('<li>');
					var a = $('<a>').attr('href','#').attr('data-value',$(this).val()).text($(this).text()).attr('style','border-radius:0;').appendTo(li);
					if(obj.val()==$(this).val()) li.addClass('active');
					dropdown.append(li);
				});
				var width = dropdown.width()+30;
				if(settings.columns>1) dropdown.addClass('large');
				var div = $('<div>').addClass('select').text(obj.find('option[value="'+obj.val()+'"]').text()).insertAfter($(this)).attr('data-dropdown','#dropdown_'+id).css({'width':width});
				dropdown.find('li').css({'width':(100/settings.columns)+'%'});
				div.miniDropdown({
					onSelect:function(o){
						obj.val($(o).attr('data-value'));
						obj.change(); // trigger change event
						$(o).parent().parent().find('.active').removeClass('active');
						$(o).parent().addClass('active');
					},
					onOpen:settings.onOpen,
					onClose:settings.onClose,
					width:settings.width,
					scroll:settings.scroll,
					columns:settings.columns
				});
				obj.hide();
                dropdown.insertAfter(obj);
				obj.change(function(){
					div.text(obj.find('option:selected').text());
				});
			}else{
			
				var settings = $.extend({
					onSelect: function(){}, // When selecting an element, returns the element selected
					onOpen: function(){}, // When opens a dropdown, returns the dropdown
					onClose: function(){}, // When close a dropdown, returns the dropdown
					width: 180, // Width of the dropdown (null:'auto' | 'parent' | 600)
					scroll: false, // Display a scrollbar on the item list
					columns: 1
				}, options);
				
			
				if($(obj.attr('data-dropdown')).length!=1) return;
				var dropdown = $(obj.attr('data-dropdown'));
				
				obj.click(function(){
					if(!obj.hasClass('dropdown-opened')){
						$('.dropdown-opened').each(function(){
							closeDropdown($(this),settings.onClose);
						});
						var o_width=obj.width()+parseInt(obj.css('padding-left'))+parseInt(obj.css('padding-right'));
						var d_width=settings.width;
						if(d_width=='parent'){
							d_width=o_width;
						}else if(d_width=='auto'){
							d_width=dropdown.width();
						}
						d_width*=settings.columns;
						var o_top = obj.offset().top+obj.height()+parseInt(obj.css('padding-top'))+parseInt(obj.css('padding-bottom'));
						if(!settings.scroll) o_top+=13; else o_top+=4;
						dropdown.css({'position':'absolute','top':o_top,'left':(obj.offset().left+(o_width/2)-(d_width/2))+1,'width':d_width});
						if(settings.scroll){
							dropdown.css({'max-height':200,'overflow-y':'scroll','overflow-x':'hidden','width':dropdown.width()}).addClass('scroll');
						}
						if(settings.columns>1) dropdown.addClass('large');
						dropdown.find('li').css({'width':(100/settings.columns)+'%'});
						if((dropdown.height()+o_top)<($(document).scrollTop()+$(window).height())){
							dropdown.removeClass('arrow-bottom').addClass('arrow-top');
						}else{
							o_top = obj.offset().top-dropdown.height()-parseInt(obj.css('padding-top'))-parseInt(obj.css('padding-bottom'));
							if(!settings.scroll) o_top-=4; else o_top+=6;
							dropdown.css({'top':o_top}).removeClass('arrow-top').addClass('arrow-bottom');
						}
						dropdown.show();
						if(dropdown.offset().left<0) dropdown.css({'left':0});
						obj.addClass('dropdown-opened');
						settings.onOpen.call(obj,dropdown);
						$(window).resize(function(){
							if(obj.hasClass('dropdown-opened')){
								closeDropdown(obj,settings.onClose);
							}
						});
					}else{
						closeDropdown(obj,settings.onClose);
					}
					return false;
				});
				
				dropdown.find('a').click(function(){
					settings.onSelect.call(obj,$(this));
					closeDropdown(obj,settings.onClose);
					if($(this).attr('href')=='#') return false;
				});
			}
			
		});
		
		function closeDropdown(obj,callback){
			var dropdown = $(obj.attr('data-dropdown'));
			dropdown.hide();
			obj.removeClass('dropdown-opened');
			callback.call(obj,dropdown);
		}
	}
})(jQuery);



/*
* MiniHints
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniHint = function(options){

		//@TODO: Options data-hint-persistent : true/false
		
		return this.each(function(){

			var link = $(this);
			var hint = $('<div>').addClass('minihint').hide();
			hint.appendTo('body');
			if(link.attr('data-hint-class')) hint.addClass(link.attr('data-hint-class'));

			$(window).load(function(){

				positionHint();
				
				if(link.attr('data-hint-permanent')=='true'){
					hint.show();
					$(window).resize(function(){ positionHint(); });
					$(document).change(function(){ positionHint(); });
				}else{
					link.hover(function(){
						positionHint();
						hint.stop().css({'display':'block','opacity':0}).animate({'opacity':1});
					},function(){
						hint.stop().animate({'opacity':0});
					});
				}
			});
			
			function positionHint(){
				hint.html(link.attr('data-hint'));
				var top=0,left=0;
				var position = link.attr('data-hint-position');
				
				if(position=='left' || position=='right'){
					top = link.offset().top + getHeight(link)/2 - getHeight(hint)/2 - parseInt(hint.css('margin-top'));
					if(position=='left'){
						left = link.offset().left - getWidth(hint) - 10;
					}else{
						left = link.offset().left + getWidth(link) + 10;
					}
				}else{
					left = link.offset().left + getWidth(link)/2 - getWidth(hint)/2;
					if(position=='bottom'){
						top = link.offset().top + getHeight(link) - parseInt(hint.css('margin-top')) + 10;
					}else{
						top = link.offset().top - (hint.height()+parseInt(hint.css('padding-top'))+parseInt(hint.css('padding-bottom'))) - parseInt(hint.css('margin-top')) - 10;
						position = 'top';
					}
				}
				hint.addClass('minihint-'+position);
				var arrow_border = $('<div>').addClass('minihint-arrow-'+position+'-border');
				arrow_border.appendTo(hint);
				var arrow = $('<div>').addClass('minihint-arrow-'+position);
				arrow.css('border-'+position+'-color',hint.css('background-color'));
				arrow.appendTo(hint);
				
				hint.css({'top':top,'left':left});
			}

			function getHeight(obj){
				return obj.height()+parseInt(obj.css('padding-top'))+parseInt(obj.css('padding-bottom'));
			}

			function getWidth(obj){
				return obj.width()+parseInt(obj.css('padding-left'))+parseInt(obj.css('padding-right'));
			}
		});
	}
})(jQuery);



/*
* MiniMobileMenu
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniMobileMenu = function(options){

		return this.each(function(){
			
			if($(this).find('.menu').length>0){
				var menu = $(this).find('.menu').first();
				var mobile_menu = menu.clone().hide().addClass('minimobilemenu').appendTo('body');
				var mobile_menu_btn = $('<div>').text('☰').addClass('minimobilemenu_btn').appendTo('body').click(function(){
					if(mobile_menu.css('display')=='none'){
						mobile_menu.css({'top':'-100%'}).show().animate({'top':0});
						$(this).hide().html('&times;').fadeIn();
					}else{
						mobile_menu.animate({'top':'-100%'},function(){
							mobile_menu.hide();
						});
						$(this).hide().text('☰').fadeIn();
					}
				});
				
				mobile_menu.find('a').click(function(){
					var link = $(this).attr('href');
					if(link!=document.location.href) $('body').fadeOut();
					
					mobile_menu.animate({'top':'100%'},function(){
						if(link!=document.location.href) document.location.href = link;
					});
					return false;
				});

				adaptSize(menu,mobile_menu,mobile_menu_btn);
				$(window).resize(function(){ adaptSize(menu,mobile_menu,mobile_menu_btn); });
			}

			function adaptSize(menu,mobile_menu,mobile_menu_btn){
				if($(window).width()<680){
					menu.hide();
					mobile_menu_btn.show();
				}else{
					menu.show();
					mobile_menu.hide();
					mobile_menu_btn.hide();
				}
			}
		});
		
	}
})(jQuery);

