var vm = new Vue({
	el: "#main",
	data: {
		list:[{name:"Jonny"}, 
				{name:"Joao"}, 
				{name:"Jean"} ]
		},
	methods:{
			add: function(){
				this.list.push({name:'Juan'});
			},
			replace: function(){
				this.list=[{name:'Edgard'}]
			}
		}
	});
