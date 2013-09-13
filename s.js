
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


$(function() {
	
	c = {};
	
	c.items = {
		trainee: {
			nb: 0,
			price: 5
		},
		coffee: {
			nb: 0,
			price: 20,
			power: 1
		},
		robot: {
			nb: 0,
			price: 2000,
			power: 5
		}
	};
	
	c.userinfos = get_cookie();
	
	if( c.userinfos==null ) {
		c.userinfos = {score : 0};
		make_cookie();
	}
	
	c.go = function() {
		
		var self = this;
		
		this.updateitem = function(i) {
			$('#item-'+i+' .nb').text(self.items[i].nb);
			$('#item-'+i+' .price').text(self.items[i].price);
		};

		for( var i in this.items ) {
			this.updateitem(i);
		}

		this.updatescore = function() {
			$('#score').html(self.userinfos.score);
		};

		this.get_power = function() {
			return 2;
		};
		
		
		this.add = function(item) {
			// on peut acheter?
			var prix = self.items[item].price;
			if( parseInt(self.userinfos.score)>=parseInt(prix)) {
				
				// OK on achete
				
				self.userinfos.score = self.userinfos.score-prix;
				prix = Math.round(1.85*prix);
				
				self.items[item].nb += 1;
				self.items[item].price = prix;
				
				self.updatescore();
				self.updateitem(item);

				// si trainee 0 --> 1:
				if( item=='trainee' && self.items.trainee.nb==1 )
					this.autoclic();
				
			}
			
		};
		
		this.autoclic = function() {

			if( parseInt(self.items.trainee.nb)>0 ) {
				$('#computer').click();
				self.updatescore();
				setTimeout(self.autoclic, 10000/self.items.trainee.nb);
			}
		};
		//this.autoclic();

		this.loop = function() {



			self.updatescore();
			setTimeout(self.loop, 500);
		};
		this.loop();
	};
	c.go();



	$('#items .btn').click(function() {
		c.add($(this).parent().parent().attr('id').replace('item-', ''));
	});

	$('#computer').click(function() {
		c.userinfos.score = parseInt(c.userinfos.score) + parseInt(c.get_power());
		c.updatescore();
		d=document.createElement('div');
		$(d).addClass('cliclic')
		    .html('clic!')
		    .appendTo($("#computer"))
		    .css({"margin-left": rand(0,100)+"px","margin-top": rand(-10,10)+"px"})
		    .animate({marginTop: '-50px', opacity: 0},800)
		    .queue(function() {
		        $(this).remove();
		    });
	});

	function get_cookie() {
		var nameEQ = "userinfo=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ')
				c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) {
				var infotemp = {};
				var infos = c.substring(nameEQ.length,c.length).split('§');
				for ( var i in infos) {
					/*var nom = infos.split(':')[0];
					var valeur = infos.split(':')[1];
					infotemp[nom] = valeur;*/
					var spl = infos[i].split(':');
					infotemp[spl[0]] = spl[1];
				}
				return infotemp;
			}
		}
		return null;
	}
	function make_cookie() {
		var date = new Date();
		var infos = new Object();
		infos.score = c.userinfos.score;
		infos.truc = "hop";
		infos.merguez = "999";
		date.setTime(date.getTime()+(30*24*3600000));
		var expires = "; expires="+date.toGMTString();
		var tt = '';
		for ( var i in infos)
			tt += '§' + i + ':' + infos[i];
		document.cookie = "userinfo="+tt.substr(1)+expires+"; path=/";
	}
	function erase_cookie() {
		document.cookie = "userinfo=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
	}


	c.prompt = false;

	Object.defineProperty(window, "save", {
	    get: function() { make_cookie(); console.clear(); return 'Game saved. Now go to work.'; }
	});
	Object.defineProperty(window, "clic", {
	    get: function() { $('#computer').click(); return 'clic!'; }
	});
	Object.defineProperty(window, "clear", {
	    get: function() { console.clear(); return 'Keep your console clean.'; }
	});
	Object.defineProperty(window, "reset", {
	    get: function() {
	    	c.prompt = 'reset';
	    	console.warn('Reset? Are you sure?');
	    	return 'y/n';
	    }
	});



	Object.defineProperty(window, "install", {
	    get: function() { return 'ok ok test'; }
	});
	Object.defineProperty(window, "merguez", {
	    get: function() { return 'ok merguez'; }
	});







	Object.defineProperty(window, "y", {
	    get: function() {
	    	if( c.prompt == false )
	    		return 'yes what?';
	    	
	    	if( c.prompt == 'reset' ) {
	    		c.prompt = false;
				erase_cookie();
				c.userinfos.score = 0;
				make_cookie();
				console.clear();
				return 'Bye bye. Now go to work.';
	    	}
	    	
	    	c.prompt = false;
	    	return 'huhu.';
	    }
	});

	Object.defineProperty(window, "n", {
	    get: function() {
			if( c.prompt == false ) { return 'no what?'; }
	    	else { c.prompt = false; return 'OK, drop.'; }
	    }
	});
});

