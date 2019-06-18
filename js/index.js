// var counter=0;
function add_word(button){
	// window.counter+=1;

	main_div=document.createElement('div');
	main_div.className="word card";
	
	div1=document.createElement('div');
	div1.className="card-header";
	// div1.appendChild(document.createTextNode("Word-"+window.counter));
	
	div2=document.createElement('div');
	div2.className="word_property_list card-body";
	div2.style="display:flex;flex-direction: row; flex-wrap: nowrap; flex-shrink: 0;overflow-x: auto;";
	
	button1=document.createElement("button");
	button1.type="submit";
	button1.setAttribute("onclick","delete_word(this)");
	button1.appendChild(document.createTextNode("Delete Word"));
	button1.className="btn btn-danger";
	button1.style="float: right;";

	button2=document.createElement("button");
	button2.type="submit";
	button2.setAttribute("onclick","add_property(this)");
	button2.appendChild(document.createTextNode("Add Property"));
	button2.className="btn btn-primary";
	button2.style="float: left;";
	
	// <input type="text" name="word_name" class="form-control" style="float: right; width: 25%;margin: 0% 1%;" placeholder="Word Variable">
	var_input=document.createElement("input");
	var_input.type="text";
	var_input.className="form-control";
	var_input.style="width:30%;margin: 0% 1%;float:right;";
	var_input.placeholder="Variable Name";

	div1.appendChild(button1);
	div1.appendChild(button2);
	div1.appendChild(var_input);

	main_div.appendChild(div1);
	main_div.appendChild(div2);
	
	document.getElementById('word_list').appendChild(main_div);

	generate_query();
}
function add_property(block){
	var properties = block.parentElement.parentElement.getElementsByClassName("word_property_list")[0];
		
	div=document.createElement("div");
	div.className="card";
	div.style="min-width: 20vw; width:20vw; margin: 1%;";
	// min-width: 10vw; min-height: 10vh; margin:1%;
	div_in=document.createElement("div");
	div_in.className="inside_card card-body";
	div_in.style="width:100%;margin: 1%;"

	select1=document.createElement("select");
	select1.className="property_name";
	select1.style="width: 100%;";
	
	options1=["ID","FORM","LEMMA","UPOSTAG","XPOSTAG","FEATS","DEPREL",];
	x=document.createElement("option");
	x.text="Feature";
	x.value="None";
	x.selected=true;
	x.disabled=true;
	select1.appendChild(x);
	for(i=0;i<options1.length;i++){
		x=document.createElement("option");
		x.text=options1[i];
		x.value=options1[i];
		select1.appendChild(x);
	}
	
	select2=document.createElement("i");
	select2.className="property_rel fa fa-equals";
	select2.style="margin:0 45%";
	select2.setAttribute("onclick","inverse(this)");
	
	// select2.style="width: 25%;margin:1%;";
	// select2.value="is"
	// options2=["is","is not"];
	// for(i=0;i<options2.length;i++){
	// 	x=document.createElement("option");
	// 	x.text=options2[i];
	// 	x.value=options2[i];
	// 	select2.appendChild(x);
	// }

	input=document.createElement("input");
	input.type="text";
	input.className="property_value";
	input.style="width:100%;margin: 1%;";

	or_button=document.createElement("button");
	or_button.type="submit";
	or_button.setAttribute("onclick","or_property(this)");
	or_button.appendChild(document.createTextNode("OR"));
	or_button.className="btn btn-primary";
	or_button.style="width:40%;float:left;margin:1%;";

	del_button=document.createElement("button");
	del_button.type="submit";
	del_button.setAttribute("onclick","delete_property(this)");
	del_button.appendChild(document.createTextNode("Delete"));
	del_button.className="btn btn-danger";
	del_button.style="width:40%;float:right;margin:1%;";
	
	div_out=document.createElement("div");
	div_out.className="card-header header_card";
	// div_out.style="width:100%;margin: 1%;"

	div_out.appendChild(or_button);
	div_out.appendChild(del_button);

	div_in.appendChild(select1);
	div_in.appendChild(select2);
	div_in.appendChild(input);
	
	// and_box=document.createElement("div");
	// and_box.className="card";
	// and_box.style="padding:1%;margin: 1%;float: left;display: inline-block;";
	// and_box.appendChild(document.createTextNode("AND"));

	div.appendChild(div_out);
	div.appendChild(div_in);
	// div.appendChild(del_button);
	
	if(properties.childElementCount>0){
		and=document.createElement("div");
		and.appendChild(document.createTextNode("AND"));
		and.style="text-align:center;color:#666666;display: flex;justify-content: center;flex-direction: column;text-align: center;";
		properties.appendChild(and);	
	}
	
	properties.appendChild(div);

	generate_query();
}

function generate_query(){
	
	var block=document.getElementById("cqp");
	var word_prop_list=document.getElementsByClassName("word_property_list");
	
	query="";

	for(i=0;i<word_prop_list.length;i++){
		query+=" [ ";
		inner_card=word_prop_list[i].getElementsByClassName("inside_card");
		for(j=0;j<inner_card.length;j++){
			query_in=" ( ";
			has_info=false;

			property_name=inner_card[j].getElementsByClassName("property_name");
			property_rel=inner_card[j].getElementsByClassName("property_rel");
			property_value=inner_card[j].getElementsByClassName("property_value");
			
			for(k=0;k<property_name.length;k++){
				name=property_name[k].value;
				rel=property_rel[k];
				value=property_value[k].value;
				
				if(name!="None" && value!=""){
					if(has_info==true)
						query_in+=" | "
					query_in+="conll:"+name;
					has_info=true;
					x=true;
					if(rel.classList.contains("fa-equals"))
						query_in+=" = ";
					else if(rel.classList.contains("fa-not-equal"))
						query_in+=" != ";
					query_in+="\""+value+"\"";
				}
			}
			query_in+=" ) ";
			if(has_info){
				if(j!=0){
					query+=" & ";
				}
				query+=query_in;
			}
		}
		query+=" ] ";
	}
	block.value=query;
}

function or_property(block){
	var prop=block.parentElement.parentElement.getElementsByClassName("inside_card")[0];

	or=document.createElement("div");
	or.appendChild(document.createTextNode("--OR--"));
	or.style="text-align:center;color:#666666;";
	
	select1=document.createElement("select");
	select1.className="property_name";
	select1.style="width: 100%;";
	options1=["FORM","LEMMA","UPOSTAG","XPOSTAG","FEATS","DEPREL"];
	x=document.createElement("option");
	x.text="Feature";
	x.value="None";
	x.selected=true;
	x.disabled=true;
	select1.appendChild(x);
	for(i=0;i<options1.length;i++){
		x=document.createElement("option");
		x.text=options1[i];
		x.value=options1[i];
		select1.appendChild(x);
	}
	
	select2=document.createElement("i");
	select2.className="property_rel fa fa-equals";
	select2.style="margin:0 45%;"
	select2.setAttribute("onclick","inverse(this)");

	input=document.createElement("input");
	input.type="text";
	input.className="property_value";
	input.style="width:100%;margin: 1%;";

	prop.appendChild(or);
	prop.appendChild(select1);
	prop.appendChild(select2);
	prop.appendChild(input);
	
}
function delete_word(block){
	var word=block.parentElement.parentElement;
	word.remove();
}

function delete_property(block){
	var prop=block.parentElement.parentElement;
	// if not the first child of the parent
	if(prop.previousSibling!=null){
		prop.previousSibling.remove();
	}
	prop.remove();	
}

function inverse(sign){
	if(sign.classList.contains("fa-equals")){
		sign.classList.replace("fa-equals","fa-not-equal");
	}
	else if(sign.classList.contains("fa-not-equal")){
		sign.classList.replace("fa-not-equal","fa-equals");
	}
}

function delete_dependency(block){
	var dependency=block.parentElement.parentElement;
	dependency.remove();
}

function add_dependency(button){
	// window.counter+=1;

	main_div=document.createElement('div');
	main_div.className="dependency card";
	
	div1=document.createElement('div');
	div1.className="card-header";
	
	div2=document.createElement('div');
	div2.className="card-body";
	div2.style="display:flex; align-items: center; justify-content: center;";
	
	button1=document.createElement("button");
	button1.type="submit";
	button1.setAttribute("onclick","delete_dependency(this)");
	button1.appendChild(document.createTextNode("Delete Dependency"));
	button1.className="btn btn-danger";
	button1.style="float: right;";

	div1.appendChild(button1)

	// input1
	input1=document.createElement("input");
	input1.type="text";
	input1.className="word_left form-control";
	input1.style="width:30%;margin: 1%;";
	input1.placeholder="Left Variable";


	// select1
	select1=document.createElement("select");
	select1.className="dependency_type";
	select1.style="width: 40%;margin: 0% 1%;";
	// options1=["nextWord"];
	x=document.createElement("option");
	x.text="Next Word";
	x.value="nextWord";
	x.selected=true;
	select1.appendChild(x);
	
	x=document.createElement("option");
	x.text="HEAD";
	x.value="HEAD";
	select1.appendChild(x);
	

	// input2
	input2=document.createElement("input");
	input2.type="text";
	input2.className="word_right form-control";
	input2.style="width:30%;margin: 0% 1%;";
	input2.placeholder="Right Variable";

	
	div2.appendChild(input1);
	div2.appendChild(select1);
	div2.appendChild(input2);
	

	main_div.appendChild(div1);
	main_div.appendChild(div2);
	
	document.getElementById('dependency_list').appendChild(main_div);

}

