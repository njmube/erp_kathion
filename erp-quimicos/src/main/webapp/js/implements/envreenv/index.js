$(function() {
	String.prototype.toCharCode = function(){
	    var str = this.split(''), len = str.length, work = new Array(len);
	    for (var i = 0; i < len; ++i){
			work[i] = this.charCodeAt(i);
	    }
	    return work.join(',');
	};
	
	$('#header').find('#header1').find('span.emp').text($('#lienzo_recalculable').find('input[name=emp]').val());
	$('#header').find('#header1').find('span.suc').text($('#lienzo_recalculable').find('input[name=suc]').val());
    var $username = $('#header').find('#header1').find('span.username');
	$username.text($('#lienzo_recalculable').find('input[name=user]').val());
	
	var $contextpath = $('#lienzo_recalculable').find('input[name=contextpath]');
	var controller = $contextpath.val()+"/controllers/envreenv";
    
    //arreglo para Tipos de Productos
    var arrayProdTipos;
    
    //arreglo de todas las Presentaciones de Productos
    //aquí tambien se incluye el valor de la equivalencia
    //Se utiliza en el buscador principal y en el plugin
    var arrayPresentaciones;
	
	//arreglo para los Envases COnfigurados para este producto
	var arregloEnvases;
	
    //Barra para las acciones
    $('#barra_acciones').append($('#lienzo_recalculable').find('.table_acciones'));
    $('#barra_acciones').find('.table_acciones').css({'display':'block'});
	var $new = $('#barra_acciones').find('.table_acciones').find('a[href*=new_item]');
	var $visualiza_buscador = $('#barra_acciones').find('.table_acciones').find('a[href*=visualiza_buscador]');
	
	$('#barra_acciones').find('.table_acciones').find('#nItem').mouseover(function(){
		$(this).removeClass("onmouseOutNewItem").addClass("onmouseOverNewItem");
	});
	$('#barra_acciones').find('.table_acciones').find('#nItem').mouseout(function(){
		$(this).removeClass("onmouseOverNewItem").addClass("onmouseOutNewItem");
	});
	
	$('#barra_acciones').find('.table_acciones').find('#vbuscador').mouseover(function(){
		$(this).removeClass("onmouseOutVisualizaBuscador").addClass("onmouseOverVisualizaBuscador");
	});
	$('#barra_acciones').find('.table_acciones').find('#vbuscador').mouseout(function(){
		$(this).removeClass("onmouseOverVisualizaBuscador").addClass("onmouseOutVisualizaBuscador");
	});
	
	//aqui va el titulo del catalogo
	$('#barra_titulo').find('#td_titulo').append('Proceso de Re-Envasado');
	
	//barra para el buscador 
	$('#barra_buscador').append($('#lienzo_recalculable').find('.tabla_buscador'));
	$('#barra_buscador').find('.tabla_buscador').css({'display':'block'});
    
	var $cadena_busqueda = "";
	var $busqueda_select_tipo_prod = $('#barra_buscador').find('.tabla_buscador').find('select[name=busqueda_select_tipo_prod]');
	var $busqueda_codigo = $('#barra_buscador').find('.tabla_buscador').find('input[name=busqueda_codigo]');
	var $busqueda_descripcion = $('#barra_buscador').find('.tabla_buscador').find('input[name=busqueda_descripcion]');
	var $busqueda_select_pres = $('#barra_buscador').find('.tabla_buscador').find('select[name=busqueda_select_pres]');
	
	var $buscar = $('#barra_buscador').find('.tabla_buscador').find('input[value$=Buscar]');
	var $limpiar = $('#barra_buscador').find('.tabla_buscador').find('input[value$=Limpiar]');
	
	
	var to_make_one_search_string = function(){
		var valor_retorno = "";
		var signo_separador = "=";
		valor_retorno += "tipo_prod" + signo_separador + $busqueda_select_tipo_prod.val() + "|";
		valor_retorno += "codigo" + signo_separador + $busqueda_codigo.val() + "|";
		valor_retorno += "descripcion" + signo_separador + $busqueda_descripcion.val() + "|";
		valor_retorno += "presentacion" + signo_separador + $busqueda_select_pres.val() + "|";
		valor_retorno += "iu" + signo_separador + $('#lienzo_recalculable').find('input[name=iu]').val() + "|";
		return valor_retorno;
	};
	
	cadena = to_make_one_search_string();
	$cadena_busqueda = cadena.toCharCode();
	
	$buscar.click(function(event){
		event.preventDefault();
		cadena = to_make_one_search_string();
		$cadena_busqueda = cadena.toCharCode();
		$get_datos_grid();
	});
	
	
	$cargar_datos_buscador_principal= function(){
		var input_json_lineas = document.location.protocol + '//' + document.location.host + '/'+controller+'/getDatosBuscadorPrincipal.json';
		$arreglo = {'iu':$('#lienzo_recalculable').find('input[name=iu]').val()}
		$.post(input_json_lineas,$arreglo,function(data){
			
			//carga select de tipos de producto
			$busqueda_select_tipo_prod.children().remove();
			var prodtipos = '<option value="0">[--Seleccionar Tipo--]</option>';
			$.each(data['ProdTipos'],function(entryIndex,tp){
				prodtipos += '<option value="' + tp['id'] + '"  >' + tp['titulo'] + '</option>';
				/*
				if(parseInt(tp['id'])==1){
					prodtipos += '<option value="' + tp['id'] + '" selected="yes">' + tp['titulo'] + '</option>';
				}else{
					prodtipos += '<option value="' + tp['id'] + '"  >' + tp['titulo'] + '</option>';
				}
				*/
			});
			$busqueda_select_tipo_prod.append(prodtipos);
			
			//carga select de Presentaciones
			$busqueda_select_pres.children().remove();
			var presentacion = '<option value="0">[-Presentaci&oacute;n--]</option>';
			$.each(data['Presentaciones'],function(entryIndex,pres){
				presentacion += '<option value="' + pres['id'] + '"  >' + pres['titulo'] + '</option>';
			});
			$busqueda_select_pres.append(presentacion);
			
			//asignar valores de presentaciones y tipo de Productos para utilizarlas mas adelante
			arrayProdTipos = data['ProdTipos'];
			arrayPresentaciones = data['Presentaciones'];
		});
	}//termina funcion cargar datos buscador principal
	
	
	//ejecutar la funcion cargar datos al cargar la pagina por primera vez
	$cargar_datos_buscador_principal();
	
	
	$limpiar.click(function(event){
		event.preventDefault();
		$busqueda_codigo.val('');
		$busqueda_descripcion.val('');
		
		//carga select de tipos de producto
		$busqueda_select_tipo_prod.children().remove();
		var prodtipos = '<option value="0">[--Seleccionar Tipo--]</option>';
		$.each(arrayProdTipos,function(entryIndex,tp){
			/*
			if(parseInt(tp['id'])==1){
				prodtipos += '<option value="' + tp['id'] + '" selected="yes">' + tp['titulo'] + '</option>';
			}else{
				prodtipos += '<option value="' + tp['id'] + '"  >' + tp['titulo'] + '</option>';
			}*/
			prodtipos += '<option value="' + tp['id'] + '"  >' + tp['titulo'] + '</option>';
		});
		$busqueda_select_tipo_prod.append(prodtipos);
		
		//carga select de Presentaciones
		$busqueda_select_pres.children().remove();
		var presentacion = '<option value="0">[-Presentaci&oacute;n--]</option>';
		$.each(arrayPresentaciones,function(entryIndex,pres){
			presentacion += '<option value="' + pres['id'] + '"  >' + pres['titulo'] + '</option>';
		});
		$busqueda_select_pres.append(presentacion);
		
		$busqueda_codigo.focus();
	});
	
	
	TriggerClickVisializaBuscador = 0;
	//visualizar  la barra del buscador
	$visualiza_buscador.click(function(event){
		event.preventDefault();
		var alto=0;
		if(TriggerClickVisializaBuscador==0){
			 TriggerClickVisializaBuscador=1;
			 var height2 = $('#cuerpo').css('height');
			 //alert('height2: '+height2);
			 
			 alto = parseInt(height2)-220;
			 var pix_alto=alto+'px';
			 //alert('pix_alto: '+pix_alto);
			 
			 $('#barra_buscador').find('.tabla_buscador').css({'display':'block'});
			 $('#barra_buscador').animate({height: '60px'}, 500);
			 $('#cuerpo').css({'height': pix_alto});
			 
			 //alert($('#cuerpo').css('height'));
		}else{
			 TriggerClickVisializaBuscador=0;
			 var height2 = $('#cuerpo').css('height');
			 alto = parseInt(height2)+220;
			 var pix_alto=alto+'px';
			 
			 $('#barra_buscador').animate({height:'0px'}, 500);
			 $('#cuerpo').css({'height': pix_alto});
		};
		$busqueda_codigo.focus();
	});
	
	
	//aplicar evento keypress a campos para ejecutar la busqueda
	$(this).aplicarEventoKeypressEjecutaTrigger($busqueda_codigo, $buscar);
	$(this).aplicarEventoKeypressEjecutaTrigger($busqueda_descripcion, $buscar);
	$(this).aplicarEventoKeypressEjecutaTrigger($busqueda_select_pres, $buscar);
	$(this).aplicarEventoKeypressEjecutaTrigger($busqueda_select_tipo_prod, $buscar);
	
	//------------------------------------------------------------------
    //valida la fecha seleccionada
    function mayor(fecha, fecha2){
        var xMes=fecha.substring(5, 7);
        var xDia=fecha.substring(8, 10);
        var xAnio=fecha.substring(0,4);
        var yMes=fecha2.substring(5, 7);
        var yDia=fecha2.substring(8, 10);
        var yAnio=fecha2.substring(0,4);

        if (xAnio > yAnio){
            return(true);
        }else{
            if (xAnio == yAnio){
                if (xMes > yMes){
                    return(true);
                }
                if (xMes == yMes){
                    if (xDia > yDia){
                        return(true);
                    }else{
                        return(false);
                    }
                }else{
                    return(false);
                }
            }else{
                return(false);
            }
        }
    }

    //muestra la fecha actual
    var mostrarFecha = function mostrarFecha(){
        var ahora = new Date();
        var anoActual = ahora.getFullYear();
        var mesActual = ahora.getMonth();
        mesActual = mesActual+1;
        mesActual = (mesActual <= 9)?"0" + mesActual : mesActual;
        var diaActual = ahora.getDate();
        diaActual = (diaActual <= 9)?"0" + diaActual : diaActual;
        var Fecha = anoActual + "-" + mesActual + "-" + diaActual;
        return Fecha;
    }
    //------------------------------------------------------------------

	
	
	
	$tabs_li_funxionalidad = function(){
		$('#forma-envreenv-window').find('#submit').mouseover(function(){
			$('#forma-envreenv-window').find('#submit').removeAttr("src").attr("src","../../img/modalbox/bt1.png");
			//$('#forma-invprodlineas-window').find('#submit').css({backgroundImage:"url(../../img/modalbox/bt1.png)"});
		});
		$('#forma-envreenv-window').find('#submit').mouseout(function(){
			$('#forma-envreenv-window').find('#submit').removeAttr("src").attr("src","../../img/modalbox/btn1.png");
		});
		$('#forma-envreenv-window').find('#boton_cancelar').mouseover(function(){
			$('#forma-envreenv-window').find('#boton_cancelar').css({backgroundImage:"url(../../img/modalbox/bt2.png)"});
		})
		$('#forma-envreenv-window').find('#boton_cancelar').mouseout(function(){
			$('#forma-envreenv-window').find('#boton_cancelar').css({backgroundImage:"url(../../img/modalbox/btn2.png)"});
		});
		
		$('#forma-envreenv-window').find('#close').mouseover(function(){
			$('#forma-envreenv-window').find('#close').css({backgroundImage:"url(../../img/modalbox/close_over.png)"});
		});
		
		$('#forma-envreenv-window').find('#close').mouseout(function(){
			$('#forma-envreenv-window').find('#close').css({backgroundImage:"url(../../img/modalbox/close.png)"});
		});
		
		$('#forma-envreenv-window').find(".contenidoPes").hide(); //Hide all content
		$('#forma-envreenv-window').find("ul.pestanas li:first").addClass("active").show(); //Activate first tab
		$('#forma-envreenv-window').find(".contenidoPes:first").show(); //Show first tab content
		
		//On Click Event
		$('#forma-envreenv-window').find("ul.pestanas li").click(function() {
			$('#forma-envreenv-window').find(".contenidoPes").hide();
			$('#forma-envreenv-window').find("ul.pestanas li").removeClass("active");
			var activeTab = $(this).find("a").attr("href");
			$('#forma-envreenv-window').find( activeTab , "ul.pestanas li" ).fadeIn().show();
			$(this).addClass("active");
			return false;
		});
		
	}
	

	
	$permitir_solo_numeros = function($campo){
		//validar campo costo, solo acepte numeros y punto
		$campo.keypress(function(e){
			// Permitir  numeros, borrar, suprimir, TAB, puntos, comas
			if (e.which == 8 || e.which == 46 || e.which==13 || e.which == 0 || (e.which >= 48 && e.which <= 57 )) {
				return true;
			}else {
				return false;
			}
		});
	}
	
	
	var $contarRegistrosActivos = function($grid_productos){
		var encontrado=0;
		
		//busca el codigo del producto en el grid
		$grid_productos.find('tr').each(function (index){
			if(parseInt($(this).find('input[name=eliminado]').val())!=0){
				encontrado++;//contador de Registros activos en el grid
			}
		});
		
		return encontrado;
	}
	
	
	//convertir la Presentacion en cantidad de acuerdo a la Unidad de Medida del Producto
	$convertirPresAUni = function(idPres, cantPres, arrayPres){
		var valor=0;
		$.each(arrayPres,function(entryIndex,pres){
			if(parseInt(pres['id'])==parseInt(idPres)){
				valor = parseFloat(cantPres) * parseFloat(pres['equivalencia']);
			}
		});
		return valor;
	}
	
	//convertir la Cantidad de Unidades en cantidad de Presentaciones
	$convertirUniAPres = function(idPres, cantUni, arrayPres){
		var valor=0;
		$.each(arrayPres,function(entryIndex,pres){
			if(parseInt(pres['id'])==parseInt(idPres)){
				valor = parseFloat(cantUni) / parseFloat(pres['equivalencia']);
				alert("idPres:"+idPres+"\ncantUni:"+cantUni+"\nequivalencia:"+pres['equivalencia']);
			}
		});
		return valor;
	}
	
	
	
	
	var $agregarTr = function(idDet, idAlm, idPres, cantPres, unidad, cantUni, noDec, arregloEnv){
		var $select_almacen_orig = $('#forma-envreenv-window').find('select[name=select_almacen_orig]');
		var $select_presentacion_orig = $('#forma-envreenv-window').find('select[name=select_presentacion_orig]');
		var $exis_pres = $('#forma-envreenv-window').find('input[name=exis_pres]');
		var $disp_pres = $('#forma-envreenv-window').find('input[name=disp_pres]');
		var $exis_uni = $('#forma-envreenv-window').find('input[name=exis_uni]');
		var $disp_uni = $('#forma-envreenv-window').find('input[name=disp_uni]');
		
		//grid de productos
		var $grid_productos = $('#forma-envreenv-window').find('#grid_productos');
		
		//obtiene numero de trs
		var noTr = $("tr", $grid_productos).size();
		noTr++;
	
		var trr = '';
		trr = '<tr>';
			trr += '<td class="grid" style="font-size:14px; font-weight:bold; border:1px solid #C1DAD7;" width="30">';
				trr += '<a href="#" id="add" class="add'+ noTr +'">&nbsp;&nbsp;+&nbsp;&nbsp;</a>';
			trr += '</td>';
			
			trr += '<td class="grid" style="font-size:15px; font-weight:bold; border:1px solid #C1DAD7;" width="30">';
				trr += '<a href="#" class="delete'+ noTr +'">&nbsp;&nbsp;-&nbsp;&nbsp;</a>';
				trr += '<input type="hidden" 	name="eliminado" id="elim" class="elim'+ noTr +'" value="1">';
				trr += '<input type="hidden" 	name="iddetalle" id="idd"  class="idd'+ noTr +'" value="'+idDet+'">';//este es el id del registro que ocupa el producto en la tabla detalle
				trr += '<input type="hidden" 	name="notr" value="'+ noTr +'">';
			trr += '</td>';
			
			trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="180">';
				trr += '<select name="select_aml_dest" class="amlDest'+ noTr +'" style="width:176px;"></select>';
			trr += '</td>';
			
			trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="130">';
				trr += '<input type="hidden" 	name="presDestId" class="presDestId'+ noTr +'" value="0">';
				trr += '<select name="select_pres_dest" class="presDest'+ noTr +'" style="width:126px;"></select>';
			trr += '</td>';
			
			trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="85">';
				trr += '<input type="text" 	name="cantpres" value="'+ cantPres +'" id="cantpres" class="cantPres'+ noTr +'" style="width:80px;" maxlength="10">';
			trr += '</td>';
			
			trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
				trr += '<input type="text" 	name="uni'+ noTr +'" value="'+ unidad +'" id="uni" class="borde_oculto" readOnly="true" style="width:86px;">';
				trr += '<input type="hidden" 	name="noDec" class="noDec'+ noTr +'" value="'+ noDec +'">';
			trr += '</td>';
			
			trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="95">';
				trr += '<input type="text" 	name="cantuni'+ noTr +'" id="cantuni" value="'+ cantUni +'" class="borde_oculto" readOnly="true" style="width:90px; text-align:right;">';
			trr += '</td>';
			
		trr += '</tr>';
		$grid_productos.append(trr);
		
		$permitir_solo_numeros($grid_productos.find('input.cantPres'+ noTr));
		
		//aqui clonamos el select de almacenes para cargar el select del grid
		$select_almacen_orig.find('option').clone().appendTo($grid_productos.find('select.amlDest'+ noTr));
		
		//aqui clonamos el select de Envases del Producto para cargar el select del grid(el select de Envases esta oculto)
		//$('#forma-envreenv-window').find('select[name=select_envases]').find('option').clone().appendTo($grid_productos.find('select.presDest'+ noTr));
		
		//cargamos los envases que son diferentes a la presentacion original
		var html_env = '<option value="0" selected="yes">[-Presentaci&oacute;n--]</option>';
		$grid_productos.find('select.presDest'+ noTr).children().remove();
			$.each(arregloEnv,function(entryIndex,env){
				if(parseInt($select_presentacion_orig.val()) != parseInt(env['id'])){
					html_env += '<option value="' + env['id'] + '"  >' + env['titulo'] + '</option>';
				}
			});
		$grid_productos.find('select.presDest'+ noTr).append(html_env);
		
		
		//al iniciar el campo tiene un  caracter en blanco, al obtener el foco se elimina el  espacio por comillas
		$grid_productos.find('input.cantPres'+ noTr).focus(function(e){
			if($(this).val().trim()==''){
				$(this).val('');
			}else{
				if( parseFloat($(this).val())==0 ){
					$(this).val('');
				}
			}
		});
		
		//al perder enfoque el campo cantidad
		$grid_productos.find('input.cantPres'+ noTr).blur(function(){
			if($(this).val().trim()==''){
				$(this).val(' ');
			}else{
				//validar numero de decimales
				var patron = /^-?[0-9]+([,\.][0-9]{0,0})?$/;
				
				if(parseInt(noDec)==1){
					patron = /^-?[0-9]+([,\.][0-9]{0,1})?$/;
				}
				if(parseInt(noDec)==2){
					patron = /^-?[0-9]+([,\.][0-9]{0,2})?$/;
				}
				if(parseInt(noDec)==3){
					patron = /^-?[0-9]+([,\.][0-9]{0,3})?$/;
				}
				if(parseInt(noDec)==4){
					patron = /^-?[0-9]+([,\.][0-9]{0,4})?$/;
				}
				if(parseInt(noDec)==5){
					patron = /^-?[0-9]+([,\.][0-9]{0,5})?$/;
				}
				if(parseInt(noDec)==6){
					patron = /^-?[0-9]+([,\.][0-9]{0,6})?$/;
				}
				
				if(!patron.test($(this).val())){
					jAlert('El n&uacute;mero de decimales es incorrecto, solo debe ser '+noDec+'.', 'Atencion!', function(r) {
						$grid_productos.find('input.cantPres'+ noTr).val('');
						$grid_productos.find('input.cantPres'+ noTr).focus();
					});
				}else{
					$(this).val( parseFloat($(this).val()).toFixed(noDec) );
				}
			}
		});
		
		
		//Agregar nueva  fila al grid
		$grid_productos.find('.add'+ noTr).bind('click',function(event){
			event.preventDefault();
			var idDetalle = 0;
			var idAlmacen = 0;
			var idPresentacion = 0;
			var cantPresentacion = 0;
			var unidadMedida = $grid_productos.find('input[name=uni'+ noTr +']').val();
			var cantUnidad = 0; 
			var noDecimales = noDec;
			
			$agregarTr(idDetalle, idAlmacen, idPresentacion, cantPresentacion, unidadMedida, cantUnidad, noDecimales, arregloEnv);
		});
		
		
		
		
		//elimina un producto del grid
		$grid_productos.find('.delete'+ noTr).bind('click',function(event){
			event.preventDefault();
			if(parseInt($(this).parent().find('#elim').val()) != 0){
				//tomamos el id detalle
				var idDetalle = $(this).parent().find('#idd').val();
				
				//asigna espacios en blanco a todos los input de la fila eliminada
				$(this).parent().parent().find('input').val(' ');
				
				//asigna un 0 al input eliminado como bandera para saber que esta eliminado
				$(this).parent().find('#elim').val(0);//cambiar valor del campo a 0 para indicar que se ha elimnado
				
				//devolvemos el id detalle para conservar el id eliminado y eliminarlo de la tabla detalle
				$(this).parent().find('#idd').val(idDetalle);
				
				//oculta la fila eliminada
				$(this).parent().parent().hide();
				
				//contar activos
				var regAct = $contarRegistrosActivos($grid_productos);
				alert(regAct);
				if(parseInt(regAct)>0 ){
					$('#forma-envreenv-window').find('input[name=valor_ant_pres]').val(0);
				}
			}
		});
		
		
		//por default el tr se agrega con estos valores
		$grid_productos.find('input.cantPres'+ noTr).attr('readonly',true);
		$grid_productos.find('input.cantPres'+ noTr).css({'background' : '#F0F0F0'});
		
		//cambiar presentacion de Envase
		$grid_productos.find('select.presDest'+ noTr).change(function(){
			var idPres = $(this).val();
			var $cantpres = $grid_productos.find('input.cantPres'+ noTr);
			var $cantuni = $grid_productos.find('input[name=cantuni'+ noTr +']');
			var noDecimales = $grid_productos.find('input.noDec'+ noTr).val();
			var $presDestId = $grid_productos.find('input.presDestId'+ noTr)
			
			if(parseInt(idPres)>0){
				if(parseFloat($exis_pres.val())>0){
					$cantpres.css({'background' : '#ffffff'});
					$cantpres.attr('readonly',false);
					
					var exisPresentaciones = $convertirUniAPres(idPres, $exis_uni.val(), arregloEnv);
					
					//llamada a la funcion que calcula la existencia convertido en la unidad del producto
					var exisUnidad = $convertirPresAUni(idPres, exisPresentaciones, arregloEnv);
					
					$cantpres.val(parseFloat(exisPresentaciones).toFixed(noDecimales));
					$cantuni.val(parseFloat(exisUnidad).toFixed(noDecimales));
					
					$presDestId.val(idPres);
				}
			}else{
				$cantpres.css({'background' : '#F0F0F0'});
				$cantpres.attr('readonly',true);
				
				$cantpres.val(parseFloat('0.00').toFixed(noDecimales));
				$cantuni.val(parseFloat('0.00').toFixed(noDecimales));
				
				jAlert('Es necesario seleccionar una Presentaci&oacute;n.', 'Atencion!', function(r) { $grid_productos.find('select.presDest'+ noTr).focus(); });
			}
		});
		
		//asignar el enfoque
		$grid_productos.find('input.cantPres'+ noTr).focus();
		
	};
	
	
	
	
	var $agregarDatosProductoSeleccionado = function(id_producto, codigo, descripcion, unidad, arregloPres, arregloEnv, noDec){
		$('#forma-envreenv-window').find('input[name=producto_id]').val(id_producto);
		$('#forma-envreenv-window').find('input[name=codigo]').val(codigo);
		$('#forma-envreenv-window').find('input[name=descripcion]').val(descripcion);
		$('#forma-envreenv-window').find('input[name=unidad]').val(unidad);
		$('#forma-envreenv-window').find('input[name=no_dec]').val(noDec);
		
		var html_pres = '<option value="0">[-Presentaci&oacute;n--]</option>';
		$('#forma-envreenv-window').find('select[name=select_presentacion_orig]').children().remove();
		if (parseInt(arregloPres.length) > 0){
			$.each(arregloPres,function(entryIndex,pres){
				html_pres += '<option value="' + pres['id'] + '"  >' + pres['titulo'] + '</option>';
			});
		}
		$('#forma-envreenv-window').find('select[name=select_presentacion_orig]').append(html_pres);
		
		var html_env = '<option value="0" selected="yes">[-Presentaci&oacute;n--]</option>';
		$('#forma-envreenv-window').find('select[name=select_envases]').children().remove();
		if (parseInt(arregloEnv.length) > 0){
			
			$.each(arregloEnv,function(entryIndex,env){
				html_env += '<option value="' + env['id'] + '"  >' + env['titulo'] + '</option>';
			});
			$('#forma-envreenv-window').find('select[name=select_envases]').append(html_env);
			
			//ocultar el buscador de productos
			$('#forma-envreenv-window').find('#buscar_producto').hide();
		}else{
			jAlert('No se ha configurado Envase para &eacute;ste Producto.', 'Atencion!', function(r) { 
				$('#forma-envreenv-window').find('input[name=codigo]').focus();
			});
		}
		
	}
	
	
	
	
	
	//buscador de productos
	var $buscador_productos = function(codigo, descripcion){
		//limpiar_campos_grids();
		$(this).modalPanel_Buscaproducto();
		var $dialogoc =  $('#forma-buscaproducto-window');
		//var $dialogoc.prependTo('#forma-buscaproduct-window');
		$dialogoc.append($('div.buscador_productos').find('table.formaBusqueda_productos').clone());
		
		$('#forma-buscaproducto-window').css({"margin-left": -200, 	"margin-top": -140});
		
		var $tabla_resultados = $('#forma-buscaproducto-window').find('#tabla_resultado');
		
		var $campo_sku = $('#forma-buscaproducto-window').find('input[name=campo_sku]');
		var $select_tipo_producto = $('#forma-buscaproducto-window').find('select[name=tipo_producto]');
		var $campo_descripcion = $('#forma-buscaproducto-window').find('input[name=campo_descripcion]');
		
		var $buscar_plugin_producto = $('#forma-buscaproducto-window').find('#busca_producto_modalbox');
		var $cancelar_plugin_busca_producto = $('#forma-buscaproducto-window').find('#cencela');
		
		//funcionalidad botones
		$buscar_plugin_producto.mouseover(function(){
			$(this).removeClass("onmouseOutBuscar").addClass("onmouseOverBuscar");
		});
		$buscar_plugin_producto.mouseout(function(){
			$(this).removeClass("onmouseOverBuscar").addClass("onmouseOutBuscar");
		});
		
		$cancelar_plugin_busca_producto.mouseover(function(){
			$(this).removeClass("onmouseOutCancelar").addClass("onmouseOverCancelar");
		});
		$cancelar_plugin_busca_producto.mouseout(function(){
			$(this).removeClass("onmouseOverCancelar").addClass("onmouseOutCancelar");
		});
		
		
		//Llena el select tipos de productos en el buscador
		$select_tipo_producto.children().remove();
		var prod_tipos_html = '';
		prod_tipos_html = '<option value="0" selected="yes">[--Seleccionar Tipo--]</option>';
		$.each(arrayProdTipos,function(entryIndex,pt){
			if(parseInt(pt['id'])!=4){
				prod_tipos_html += '<option value="' + pt['id'] + '"  >' + pt['titulo'] + '</option>';
			}
		});
		$select_tipo_producto.append(prod_tipos_html);
		
		
		$campo_sku.val(codigo);
		$campo_descripcion.val(descripcion);
		$campo_sku.focus();
		
		//click buscar productos
		$buscar_plugin_producto.click(function(event){
			//event.preventDefault();
			var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getBuscadorProductos.json';
			$arreglo = {	'sku':$campo_sku.val(),
							'tipo':$select_tipo_producto.val(),
							'descripcion':$campo_descripcion.val(),
							'iu':$('#lienzo_recalculable').find('input[name=iu]').val()
						}
			
			var trr = '';
			$tabla_resultados.children().remove();
			$.post(input_json,$arreglo,function(entry){
				$.each(entry['Productos'],function(entryIndex,producto){
					trr = '<tr>';
						trr += '<td width="120">';
							trr += '<input type="hidden" id="id_prod_buscador" value="'+producto['id']+'">';
							trr += '<span class="codigo_prod_buscador">'+producto['sku']+'</span>';
						trr += '</td>';
						trr += '<td width="280"><span class="descripcion_prod_buscador">'+producto['descripcion']+'</span></td>';
						trr += '<td width="90">';
							trr += '<span class="unidad_id" style="display:none;">'+producto['unidad_id']+'</span>';
							trr += '<span class="dec" style="display:none;">'+producto['decimales']+'</span>';
							trr += '<span class="unidad_prod_buscador">'+producto['unidad']+'</span>';
						trr += '</td>';
						trr += '<td width="90"><span class="tipo_prod_buscador">'+producto['tipo']+'</span></td>';
					trr += '</tr>';
					
					$tabla_resultados.append(trr);
				});
				$tabla_resultados.find('tr:odd').find('td').css({'background-color' : '#e7e8ea'});
				$tabla_resultados.find('tr:even').find('td').css({'background-color' : '#FFFFFF'});
				
				$('tr:odd' , $tabla_resultados).hover(function () {
					$(this).find('td').css({background : '#FBD850'});
				}, function() {
					//$(this).find('td').css({'background-color':'#DDECFF'});
					$(this).find('td').css({'background-color':'#e7e8ea'});
				});
				$('tr:even' , $tabla_resultados).hover(function () {
					$(this).find('td').css({'background-color':'#FBD850'});
				}, function() {
					$(this).find('td').css({'background-color':'#FFFFFF'});
				});
				
				//seleccionar un producto del grid de resultados
				$tabla_resultados.find('tr').click(function(){
					//asignar a los campos correspondientes el sku y y descripcion
					var id_producto = $(this).find('#id_prod_buscador').val();
					var codigo = $(this).find('span.codigo_prod_buscador').html();
					var descripcion = $(this).find('span.descripcion_prod_buscador').html();
					var unidad = $(this).find('span.unidad_prod_buscador').html();
					var cantidad=0;
					var iddetalle=0;
					var noDec = $(this).find('span.dec').html();
					
					//aqui nos vamos a buscar las presentaciones del Producto seleccionado
					var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getPresentacionesProducto.json';
					$arreglo = {'id_prod':id_producto,'iu':$('#lienzo_recalculable').find('input[name=iu]').val() };
					$.post(input_json,$arreglo,function(entry){
						//se la asigna valor al arreglo global de Envases
						arregloEnvases=entry['Envases'];
						
						//llamada a la funcion para agregar los datos del Producto seleccionado
						$agregarDatosProductoSeleccionado(id_producto, codigo, descripcion, unidad, entry['Presentaciones'], entry['Envases'], noDec);
					});

					//elimina la ventana de busqueda
					var remove = function() {$(this).remove();};
					$('#forma-buscaproducto-overlay').fadeOut(remove);
				});
			});
		});
		
		//si hay algo en el campo sku al cargar el buscador, ejecuta la busqueda
		if($campo_sku.val() != ''  ||  $campo_descripcion.val() != ''){
			$buscar_plugin_producto.trigger('click');
		}
		
		$(this).aplicarEventoKeypressEjecutaTrigger($campo_sku, $buscar_plugin_producto);
		$(this).aplicarEventoKeypressEjecutaTrigger($campo_descripcion, $buscar_plugin_producto);
		$(this).aplicarEventoKeypressEjecutaTrigger($select_tipo_producto, $buscar_plugin_producto);
		
		$cancelar_plugin_busca_producto.click(function(event){
			//event.preventDefault();
			var remove = function() {$(this).remove();};
			$('#forma-buscaproducto-overlay').fadeOut(remove);
			
			//asignar el enfoque al campo sku del producto
			if(parseInt(tipoBusqueda)==1){
				$('#forma-envreenv-window').find('input[name=codigo]').focus();
			}else{
				$('#forma-envreenv-window').find('input[name=codigo_componente]').focus();
			}
		});
	}//termina buscador de productos
	
	
	
	
	
	//carga los campos select con los datos que recibe como parametro
	$carga_campos_select = function($campo_select, arreglo_elementos, elemento_seleccionado, texto_elemento_cero, indiceId, indiceTitulo){
		$campo_select.children().remove();
		var select_html = '';
		
		if(texto_elemento_cero != ""){
			select_html = '<option value="0">'+texto_elemento_cero+'</option>';
		}
		
		$.each(arreglo_elementos,function(entryIndex,elemento){
			if( parseInt(elemento['id']) == parseInt(elemento_seleccionado) ){
				select_html += '<option value="' + elemento[indiceId] + '" selected="yes">' + elemento[indiceTitulo] + '</option>';
			}else{
				select_html += '<option value="' + elemento[indiceId] + '" >' + elemento[indiceTitulo] + '</option>';
			}
		});
		$campo_select.append(select_html);
	}
	
	
	//vaciar campos
	$vaciar_campos = function($producto_id, $codigo, $descripcion, $unidad, $exis_pres, $disp_pres, $exis_uni, $disp_uni, $select_presentacion_orig, $select_envases, $grid_productos, $buscar_producto){
		$producto_id.attr(0);
		$codigo.val('');
		$descripcion.val('');
		$unidad.val('');
		$exis_pres.val('0.00');
		$disp_pres.val('0.00');
		$exis_uni.val('0.00');
		$disp_uni.val('0.00');
		
		$select_presentacion_orig.children().remove();
		var html_pres = '<option value="0" selected="yes">[--Presentaci&oacute;n--]</option>';
		$select_presentacion_orig.append(html_pres);
		
		$select_envases.children().remove();
		$select_envases.append(html_pres);
		
		$grid_productos.children().remove();
		
		$buscar_producto.show();
	}
	
	
	
	//nuevo 
	$new.click(function(event){
		event.preventDefault();
		var id_to_show = 0;
		$(this).modalPanel_modalboxenvreenv();
		
		var form_to_show = 'formaenvreenv00';
		$('#' + form_to_show).each (function(){this.reset();});
		var $forma_selected = $('#' + form_to_show).clone();
		$forma_selected.attr({id : form_to_show + id_to_show});
		
		$('#forma-envreenv-window').css({"margin-left": -390, 	"margin-top": -210});
		$forma_selected.prependTo('#forma-envreenv-window');
		$forma_selected.find('.panelcito_modal').attr({id : 'panelcito_modal' + id_to_show , style:'display:table'});
		$tabs_li_funxionalidad();
		
		var $identificador = $('#forma-envreenv-window').find('input[name=identificador]');
		var $folio = $('#forma-envreenv-window').find('input[name=folio]');
		var $select_estatus = $('#forma-envreenv-window').find('select[name=select_estatus]');
		var $fecha = $('#forma-envreenv-window').find('input[name=fecha]');
		var $select_empleado = $('#forma-envreenv-window').find('select[name=select_empleado]');
		var $select_almacen_orig = $('#forma-envreenv-window').find('select[name=select_almacen_orig]');
		var $producto_id = $('#forma-envreenv-window').find('input[name=producto_id]');
		var $codigo = $('#forma-envreenv-window').find('input[name=codigo]');
		var $descripcion = $('#forma-envreenv-window').find('input[name=descripcion]');
		var $select_presentacion_orig = $('#forma-envreenv-window').find('select[name=select_presentacion_orig]');
		var $valor_ant_pres = $('#forma-envreenv-window').find('input[name=valor_ant_pres]');
		var $select_envases = $('#forma-envreenv-window').find('select[name=select_envases]');
		var $exis_pres = $('#forma-envreenv-window').find('input[name=exis_pres]');
		var $disp_pres = $('#forma-envreenv-window').find('input[name=disp_pres]');
		var $unidad = $('#forma-envreenv-window').find('input[name=unidad]');
		var $no_dec = $('#forma-envreenv-window').find('input[name=no_dec]');
		var $exis_uni = $('#forma-envreenv-window').find('input[name=exis_uni]');
		var $disp_uni = $('#forma-envreenv-window').find('input[name=disp_uni]');
		
		//href para Agregar y Buscar producto
		var $buscar_producto = $('#forma-envreenv-window').find('#buscar_producto');
		
		//grid de productos
		var $grid_productos = $('#forma-envreenv-window').find('#grid_productos');
		
		//grid de errores
		var $grid_warning = $('#forma-envreenv-window').find('#div_warning_grid').find('#grid_warning');
		
		var $cerrar_plugin = $('#forma-envreenv-window').find('#close');
		var $cancelar_plugin = $('#forma-envreenv-window').find('#boton_cancelar');
		var $submit_actualizar = $('#forma-envreenv-window').find('#submit');
		
		
		$fecha.val(mostrarFecha());
		
		$fecha.DatePicker({
			format:'Y-m-d',
			date: $fecha.val(),
			current: $fecha.val(),
			starts: 1,
			position: 'bottom',
			locale: {
				days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'],
				daysShort: ['Dom', 'Lun', 'Mar', 'Mir', 'Jue', 'Vir', 'Sab','Dom'],
				daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa','Do'],
				months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo','Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'],
				monthsShort: ['Ene', 'Feb', 'Mar', 'Abr','May', 'Jun', 'Jul', 'Ago','Sep', 'Oct', 'Nov', 'Dic'],
				weekMin: 'se'
			},
			onChange: function(formated, dates){
				var patron = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$");
				$fecha.val(formated);
				if (formated.match(patron) ){
					var valida_fecha=mayor($fecha.val(),mostrarFecha());

					if (valida_fecha==true){
						jAlert("Fecha no valida",'! Atencion');
						$fecha.val(mostrarFecha());
					}else{
						$fecha.DatePickerHide();
					}
				}
			}
		});

		$fecha.click(function (s){
			var a=$('div.datepicker');
			a.css({
				'z-index':100
			});
		});
		
		//aplicar mascara a campos para entrada manual de fecha
		//9 indica que va a permitir captura de numeros solamante
		$fecha.mask('9999-99-99');
		
		$identificador.attr({'value' : 0});
		$producto_id.attr({'value' : 0});
		$exis_pres.val('0.00');
		$disp_pres.val('0.00');
		$exis_uni.val('0.00');
		$disp_uni.val('0.00');
		
		$folio.css({'background' : '#F0F0F0'});
		$exis_pres.css({'background' : '#F0F0F0'});
		$disp_pres.css({'background' : '#F0F0F0'});
		$unidad.css({'background' : '#F0F0F0'});
		$exis_uni.css({'background' : '#F0F0F0'});
		$disp_uni.css({'background' : '#F0F0F0'});
		
		//quitar enter a todos los campos input
		$('#forma-envreenv-window').find('input').keypress(function(e){
			if(e.which==13 ) {
				return false;
			}
		});
		
		
		//asignar el enfoque al cargar la ventana
		$codigo.focus();
		
		var respuestaProcesada = function(data){
			if ( data['success'] == 'true' ){
				var remove = function() {$(this).remove();};
				$('#forma-envreenv-overlay').fadeOut(remove);
				jAlert("Los datos de la configuraci&oacute;n se guardaron con &eacute;xito.", 'Atencion!');
				$get_datos_grid();
			}else{
				// Desaparece todas las interrogaciones si es que existen
				$('#forma-envreenv-window').find('div.interrogacion').css({'display':'none'});
				$('#forma-envreenv-window').find('.envreenv_div_one').css({'height':'390px'});//sin errores
				
				$grid_productos.find('#cant').css({'background' : '#ffffff'});
				$grid_productos.find('#cost').css({'background' : '#ffffff'});
				
				$('#forma-envreenv-window').find('#div_warning_grid').css({'display':'none'});
				$('#forma-envreenv-window').find('#div_warning_grid').find('#grid_warning').children().remove();
				
				var valor = data['success'].split('___');
				//muestra las interrogaciones
				for (var element in valor){
					tmp = data['success'].split('___')[element];
					longitud = tmp.split(':');
					if( longitud.length > 1 ){
						$('#forma-envreenv-window').find('img[rel=warning_' + tmp.split(':')[0] + ']')
						.parent()
						.css({'display':'block'})
						.easyTooltip({tooltipId: "easyTooltip2",content: tmp.split(':')[1]});
						
						var campo = tmp.split(':')[0];
						var $campo_input;
						var cantidad_existencia=0;
						var  width_td=0;
						
						if(tmp.split(':')[0].substring(0,4) == 'cant'){
							
							$('#forma-envreenv-window').find('#div_warning_grid').css({'display':'block'});
							$('#forma-envreenv-window').find('.envreenv_div_one').css({'height':'490px'});//con errores
							$campo_input = $grid_productos.find('.'+campo);
							$campo_input.css({'background' : '#d41000'});
							
							var codigo_producto = $campo_input.parent().parent().find('input[name=cod]').val();
							var titulo_producto = $campo_input.parent().parent().find('input[name=desc]').val();
							
							var tr_warning = '<tr>';
									tr_warning += '<td width="20"><div><img src="../../img/icono_advertencia.png" align="top" rel="warning_sku"></td>';
									tr_warning += '<td width="90"><input type="text" value="' + codigo_producto + '" class="borde_oculto" readOnly="true" style="width:88px; color:red"></td>';
									tr_warning += '<td width="160"><input type="text" value="' + titulo_producto + '" class="borde_oculto" readOnly="true" style="width:160px; color:red"></td>';
									tr_warning += '<td width="380"><input type="text" value="'+  tmp.split(':')[1] +'" class="borde_oculto" readOnly="true" style="width:380px; color:red"></td>';
							tr_warning += '</tr>';
							
							$('#forma-envreenv-window').find('#div_warning_grid').find('#grid_warning').append(tr_warning);
						}
					}
				}
				
				$grid_warning.find('tr:odd').find('td').css({'background-color' : '#FFFFFF'});
				$grid_warning.find('tr:even').find('td').css({'background-color' : '#e7e8ea'});
			}
		}
		
		var options = {dataType :  'json', success : respuestaProcesada};
		$forma_selected.ajaxForm(options);
		
		var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getReenv.json';
		$arreglo = {'id':id_to_show, 'iu':$('#lienzo_recalculable').find('input[name=iu]').val() };
		
		$.post(input_json,$arreglo,function(entry){
			var elemento_seleccionado=0;
			var texto_elemento_cero='';
			var indiceId = 'id';
			var indiceTitulo = 'titulo';
			$carga_campos_select($select_estatus, entry['Estatus'], elemento_seleccionado, texto_elemento_cero, indiceId, indiceTitulo);
			
			elemento_seleccionado=0;
			texto_elemento_cero='';
			indiceId = 'id';
			indiceTitulo = 'titulo';
			$carga_campos_select($select_almacen_orig, entry['Almacenes'], elemento_seleccionado, texto_elemento_cero, indiceId, indiceTitulo);
			
			elemento_seleccionado=0;
			texto_elemento_cero='';
			indiceId = 'id';
			indiceTitulo = 'nombre_empleado';
			$carga_campos_select($select_empleado, entry['Empleados'], elemento_seleccionado, texto_elemento_cero, indiceId, indiceTitulo);
			
		});//termina llamada json
		
		
		$buscar_producto.click(function(event){
			event.preventDefault();
			$buscador_productos($codigo.val(), $descripcion.val() );
		});
		
		//aplicar evento click para que al pulsar Enter sobre el campo Descripcion de la busqueda del producto Principal, se ejecute el buscador
		$(this).aplicarEventoKeypressEjecutaTrigger($descripcion, $buscar_producto);
		
		$codigo.keypress(function(e){
			var valor=$(this).val();
			
			if(e.which == 13){
				var input_json2 = document.location.protocol + '//' + document.location.host + '/'+controller+'/gatDatosProducto.json';
				var $arreglo2 = {'codigo':$codigo.val(), 'iu':$('#lienzo_recalculable').find('input[name=iu]').val() };
				$.post(input_json2,$arreglo2,function(entry2){
					if(parseInt(entry2['Producto'].length) > 0 ){
						var id_producto = entry2['Producto'][0]['id'];
						var codigo = entry2['Producto'][0]['sku'];
						var descripcion = entry2['Producto'][0]['descripcion'];
						var unidad = entry2['Producto'][0]['unidad'];
						var noDec = entry2['Producto'][0]['decimales'];
						
						//se la asigna valor al arreglo global de Envases
						arregloEnvases=entry2['Envases'];
						
						//llamada a la funcion para agregar datos del producto
						$agregarDatosProductoSeleccionado(id_producto, codigo, descripcion, unidad, entry2['Presentaciones'], entry2['Envases'], noDec);
					}else{
						jAlert('C&oacute;digo de Producto desconocido.', 'Atencion!', function(r) { 
							$codigo.focus(); 
						});
					}
				});
				return false;
			}else{
				if (parseInt(e.which) == 8) {
					//si se oprime la tecla borrar se vacia el campo codigo, descripcion
					//tambien vaciamos los select de presentacion y envases(envases está oculto)
					if(parseInt($("tr", $grid_productos).size())>0){
						//si hay elementos en el grid, preguntar si se desea cambiar el producto seleccionado
						jConfirm('Hay presentaciones en el Listado, \n&eacute;sta seguro que desea cambiar el Producto seleccionado?', 'Dialogo de Confirmacion', function(r) {
							// If they confirmed, manually trigger a form submission
							if (r) {
								$vaciar_campos($producto_id, $codigo, $descripcion, $unidad, $exis_pres, $disp_pres, $exis_uni, $disp_uni, $select_presentacion_orig, $select_envases, $grid_productos, $buscar_producto);
								arregloEnvases=null;
								return true;
							}else{
								$codigo.val(valor);
								return false;
							}
						});
					}else{
						//si no hay elementos en el grid, vaciar sin preguntar
						$vaciar_campos($producto_id, $codigo, $descripcion, $unidad, $exis_pres, $disp_pres, $exis_uni, $disp_uni, $select_presentacion_orig, $select_envases, $grid_productos, $buscar_producto);
					}
				}
			}
		});
		
		
		
		
		
		
		$aplicarEventoChange = function($campo_select){
			$campo_select.change(function(){
				var idPres = $(this).val();
				
				//contar registros activos en el grid
				var regAct = $contarRegistrosActivos($grid_productos);
				
				if(parseInt(regAct)<=0 ){
					if(parseInt(idPres)>0){
						//buscar existencias al seleccionar una presentacion
						var input_json3 = document.location.protocol + '//' + document.location.host + '/'+controller+'/getExisPres.json';
						var $arreglo3 = {'id_prod':$producto_id.val(), 'id_pres':idPres, 'id_alm':$select_almacen_orig.val(), 'iu':$('#lienzo_recalculable').find('input[name=iu]').val() };
						
						$.post(input_json3,$arreglo3,function(entry3){
							if(parseInt(entry3['Exis'].length) > 0 ){
								var exisPres = entry3['Exis'][0]['exis'];
								var noDec = entry3['Exis'][0]['decimales'];
								
								//llamada a la funcion que calcula la existencia convertido en la unidad del producto
								var exisUnidad = $convertirPresAUni(idPres, exisPres, arrayPresentaciones);
								
								$exis_pres.val(exisPres);
								$disp_pres.val(exisPres);
								$exis_uni.val(parseFloat(exisUnidad).toFixed(noDec));
								$disp_uni.val(parseFloat(exisUnidad).toFixed(noDec));
								
								var idDetalle = 0;
								var idAlmacen = 0;
								var idPresentacion = 0;
								var cantPresentacion = 0;
								var unidadMedida = $unidad.val();
								var cantUnidad = 0;
								var noDecimales = $no_dec.val();
								
								$agregarTr(idDetalle, idAlmacen, idPresentacion, cantPresentacion, unidadMedida, cantUnidad, noDecimales, arregloEnvases);
								
							}else{
								$exis_pres.val('0.00');
								$disp_pres.val('0.00');
								$exis_uni.val('0.00');
								$disp_uni.val('0.00');
								jAlert('No hay existencias en &eacute;sta Presentaci&oacute;n..', 'Atencion!', function(r) { 
									$campo_select.focus();
								});
							}
						});
					}else{
						$exis_pres.val('0.00');
						$disp_pres.val('0.00');
						$exis_uni.val('0.00');
						$disp_uni.val('0.00');
						jAlert('Es necesario seleccionar una Presentaci&oacute;n.', 'Atencion!', function(r) { $campo_select.focus(); });
					}
					
					$valor_ant_pres.val(idPres);
				}else{
					if(parseInt($valor_ant_pres.val())>0 ){
						jAlert('No es posible cambiar la Presentaci&oacute;n, hay registros en el listado para envasar.\nElimine los Envases del listado para habilitar el cambio de la Presentaci&oacute;n.', 'Atencion!', function(r) { 
							var html_select='';
							
							$campo_select.find('option').each(function(){
								if(parseInt($(this).val())==parseInt($valor_ant_pres.val())){
									html_select += '<option value="' + $(this).val() + '" selected="yes">' + $(this).text() + '</option>';
								}else{
									html_select += '<option value="' + $(this).val() + '"  >' + $(this).text() + '</option>';
								}
							});
							
							$campo_select.children().remove();
							$campo_select.append(html_select);
							
							$campo_select.focus();
						});
					}else{
						//aqui es una llamada recursiva a esta misma funcion
						$aplicarEventoChange($campo_select);
					}
				}
			});
		}
		
		
		//aplicar el evento change
		$aplicarEventoChange($select_presentacion_orig);
		
		
		
		$submit_actualizar.bind('click',function(){
			var trCount = $("tr", $grid_productos).size();
			if(parseInt(trCount) > 0){
				return true;
			}else{
				jAlert('Es necesario agregar productos en el listado.', 'Atencion!', function(r) { $codigo.focus(); });
				return false;
			}
		});
		
		$cerrar_plugin.bind('click',function(){
			var remove = function() {$(this).remove();};
			$('#forma-envreenv-overlay').fadeOut(remove);
		});
		
		$cancelar_plugin.click(function(event){
			var remove = function() {$(this).remove();};
			$('#forma-envreenv-overlay').fadeOut(remove);
			$buscar.trigger('click');
		});
	});
	
	
	
	var carga_formaenvreenv00_for_datagrid00 = function(id_to_show, accion_mode){
		//aqui entra para eliminar 
		if(accion_mode == 'cancel'){
                     
			var input_json = document.location.protocol + '//' + document.location.host + '/' + controller + '/' + 'logicDelete.json';
			$arreglo = {'id':id_to_show,
						'iu': $('#lienzo_recalculable').find('input[name=iu]').val()
						};
			jConfirm('Realmente desea eliminar configuraci&oacute;n seleccionada?', 'Dialogo de confirmacion', function(r) {
				if (r){
					$.post(input_json,$arreglo,function(entry){
						if ( entry['success'] == '1' ){
							jAlert("La configuraci&oacute;n  fue eliminada exitosamente.", 'Atencion!');
							$get_datos_grid();
						}
						else{
							jAlert("La configuraci&oacute;n no pudo ser eliminada.", 'Atencion!');
						}
					},"json");
				}
			});
		}else{
			//aqui  entra para editar un registro
			var form_to_show = 'formaenvreenv00';
			
			$('#' + form_to_show).each (function(){this.reset();});
			var $forma_selected = $('#' + form_to_show).clone();
			$forma_selected.attr({id : form_to_show + id_to_show});
			
			$(this).modalPanel_modalboxenvreenv();
			$('#forma-envreenv-window').css({"margin-left": -350, 	"margin-top": -200});
			
			$forma_selected.prependTo('#forma-envreenv-window');
			$forma_selected.find('.panelcito_modal').attr({id : 'panelcito_modal' + id_to_show , style:'display:table'});
			
			$tabs_li_funxionalidad();
		
			var $identificador = $('#forma-envreenv-window').find('input[name=identificador]');
			var $producto_id = $('#forma-envreenv-window').find('input[name=producto_id]');
			var $codigo = $('#forma-envreenv-window').find('input[name=codigo]');
			var $descripcion = $('#forma-envreenv-window').find('input[name=descripcion]');
			var $unidad = $('#forma-envreenv-window').find('input[name=unidad]');
			var $select_presentacion = $('#forma-envreenv-window').find('select[name=select_presentacion]');
			
			//href para Agregar y Buscar producto
			var $agregar_producto = $('#forma-envreenv-window').find('#agregar_producto');
			var $buscar_producto = $('#forma-envreenv-window').find('#buscar_producto');
			
			//Codigo y Nombre del producto componente del Envase
			var $codigo_componente = $('#forma-envreenv-window').find('input[name=codigo_componente]');
			var $nombre_componente = $('#forma-envreenv-window').find('input[name=nombre_componente]');
			
			//href para Agregar y Buscar producto Elemento del Envase
			var $agregar_producto_componente = $('#forma-envreenv-window').find('a[href=agregar_producto_componente]');
			var $buscar_producto_componente = $('#forma-envreenv-window').find('a[href=buscar_producto_componente]');
			
			//grid de productos
			var $grid_productos = $('#forma-envreenv-window').find('#grid_productos');
			
			//grid de errores
			var $grid_warning = $('#forma-envreenv-window').find('#div_warning_grid').find('#grid_warning');
			
			
			var $cerrar_plugin = $('#forma-envreenv-window').find('#close');
			var $cancelar_plugin = $('#forma-envreenv-window').find('#boton_cancelar');
			var $submit_actualizar = $('#forma-envreenv-window').find('#submit');
			
			$agregar_producto.hide();
			$buscar_producto.hide();
			
			$unidad.css({'background' : '#F0F0F0'});
			$codigo.css({'background' : '#F0F0F0'});
			$descripcion.css({'background' : '#F0F0F0'});
			$codigo.attr('readonly',true);
			$descripcion.attr('readonly',true);
			
			//quitar enter a todos los campos input
			$('#forma-envreenv-window').find('input').keypress(function(e){
				if(e.which==13 ) {
					return false;
				}
			});
			
			if(accion_mode == 'edit'){
				var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getReenv.json';
				$arreglo = {'id':id_to_show, 'iu':$('#lienzo_recalculable').find('input[name=iu]').val() };
				
				var respuestaProcesada = function(data){
					if ( data['success'] == 'true' ){
						var remove = function() {$(this).remove();};
						$('#forma-envreenv-overlay').fadeOut(remove);
						jAlert("Los datos de la configuraci&oacute;n se han actualizado con &eacute;xito.", 'Atencion!');
						$get_datos_grid();
					}else{
						// Desaparece todas las interrogaciones si es que existen
						$('#forma-envreenv-window').find('div.interrogacion').css({'display':'none'});
						$('#forma-envreenv-window').find('.envreenv_div_one').css({'height':'390px'});//sin errores
								
						$grid_productos.find('#cant').css({'background' : '#ffffff'});
						$grid_productos.find('#cost').css({'background' : '#ffffff'});
						
						$('#forma-envreenv-window').find('#div_warning_grid').css({'display':'none'});
						$('#forma-envreenv-window').find('#div_warning_grid').find('#grid_warning').children().remove();
				
						var valor = data['success'].split('___');
						//muestra las interrogaciones
						for (var element in valor){
							tmp = data['success'].split('___')[element];
							longitud = tmp.split(':');
							if( longitud.length > 1 ){
								$('#forma-envreenv-window').find('img[rel=warning_' + tmp.split(':')[0] + ']')
								.parent()
								.css({'display':'block'})
								.easyTooltip({tooltipId: "easyTooltip2",content: tmp.split(':')[1]});
								
								
								var campo = tmp.split(':')[0];
								var $campo_input;
								var cantidad_existencia=0;
								var  width_td=0;
								
								if(tmp.split(':')[0].substring(0,4) == 'cant'){
									
									$('#forma-envreenv-window').find('#div_warning_grid').css({'display':'block'});
									$('#forma-envreenv-window').find('.envreenv_div_one').css({'height':'490px'});//con errores
									
									$campo_input = $grid_productos.find('.'+campo);
									$campo_input.css({'background' : '#d41000'});
									
									var codigo_producto = $campo_input.parent().parent().find('input[name=cod]').val();
									var titulo_producto = $campo_input.parent().parent().find('input[name=desc]').val();
									
									var tr_warning = '<tr>';
											tr_warning += '<td width="20"><div><img src="../../img/icono_advertencia.png" align="top" rel="warning_sku"></td>';
											tr_warning += '<td width="90"><input type="text" value="' + codigo_producto + '" class="borde_oculto" readOnly="true" style="width:88px; color:red"></td>';
											tr_warning += '<td width="160"><input type="text" value="' + titulo_producto + '" class="borde_oculto" readOnly="true" style="width:160px; color:red"></td>';
											tr_warning += '<td width="380"><input type="text" value="'+  tmp.split(':')[1] +'" class="borde_oculto" readOnly="true" style="width:380px; color:red"></td>';
									tr_warning += '</tr>';
									
									$('#forma-envreenv-window').find('#div_warning_grid').find('#grid_warning').append(tr_warning);
								}
							}
						}
						
						$grid_warning.find('tr:odd').find('td').css({'background-color' : '#FFFFFF'});
						$grid_warning.find('tr:even').find('td').css({'background-color' : '#e7e8ea'});
						
					}
				}
				
				var options = {dataType :  'json', success : respuestaProcesada};
				$forma_selected.ajaxForm(options);
				
				//aqui se cargan los campos al editar
				$.post(input_json,$arreglo,function(entry){
					$identificador.attr({'value' : entry['Datos']['0']['id']});
					$producto_id.attr({'value' : entry['Datos']['0']['producto_id']});
					$codigo.attr({'value' : entry['Datos']['0']['codigo']});
					$descripcion.attr({'value' : entry['Datos']['0']['descripcion']});
					$unidad.attr({'value' : entry['Datos']['0']['unidad']});
					
					$select_presentacion.children().remove();
					var html_pres = '';
					$.each(entry['Presentaciones'],function(entryIndex,pres){
						if(parseInt(entry['Datos']['0']['presentacion_id']) == parseInt(pres['id'] )){
							html_pres += '<option value="' + pres['id'] + '" selected="yes">' + pres['titulo'] + '</option>';
						}else{
							html_pres += '<option value="' + pres['id'] + '"  >' + pres['titulo'] + '</option>';
						}
					});
					$select_presentacion.append(html_pres);							
					
					
					//verificar que el arreglo traiga datos
					if(parseInt(entry['DatosGrid'].length) > 0){
						$.each(entry['DatosGrid'],function(entryIndex,prod){
							var id_producto = prod['id_prod'];
							var codigo = prod['codigo'];
							var descripcion = prod['descripcion'];
							var unidad = prod['unidad'];
							var cantidad = prod['cant'];
							var iddetalle = prod['iddet'];
							var noDec = prod['precision'];
							
							//llamada a la funcion para agregar tr al grid
							$agregarTr(id_producto, codigo, descripcion, unidad, cantidad, iddetalle, noDec);
						});
					}
				},"json");//termina llamada json
				
				
				
				//Buscar Productos Componentes
				$buscar_producto_componente.click(function(event){
					event.preventDefault();
					//tipo=2 para buscar los productos Componentes
					var tipoBusqueda=2;
					$buscador_productos(tipoBusqueda, $codigo_componente.val(), $nombre_componente.val() );
				});
				
				$agregar_producto_componente.click(function(event){
					event.preventDefault();
					var input_json3 = document.location.protocol + '//' + document.location.host + '/'+controller+'/gatDatosProducto.json';
					var $arreglo3 = {'codigo':$codigo_componente.val(), 'iu':$('#lienzo_recalculable').find('input[name=iu]').val() };
					
					$.post(input_json3,$arreglo3,function(entry3){
						if(parseInt(entry3['Producto'].length) > 0 ){
							var id_producto = entry3['Producto'][0]['id'];
							var codigo = entry3['Producto'][0]['sku'];
							var descripcion = entry3['Producto'][0]['descripcion'];
							var unidad = entry3['Producto'][0]['unidad'];
							var cantidad=0;
							var iddetalle=0;
							var noDec = entry3['Producto'][0]['decimales'];
							
							//llamada a la funcion para agregar tr al grid
							$agregarTr(id_producto, codigo, descripcion, unidad, cantidad, iddetalle, noDec);
							
						}else{
							jAlert('C&oacute;digo de Producto desconocido.', 'Atencion!', function(r) { 
								$codigo_componente.focus(); 
							});
						}
					});
				});
				
				
				//agrega productos componentes al grid
				$codigo_componente.keypress(function(e){
					if(e.which == 13){
						$agregar_producto_componente.trigger('click');
						return false;
					}
				});
				
				//aplicar evento click para que al pulsar Enter sobre el campo Descripcion de la busqueda del producto componente, se ejecute el buscador
				$(this).aplicarEventoKeypressEjecutaTrigger($nombre_componente, $buscar_producto_componente);
				
				$codigo_componente.focus();
				
				//Ligamos el boton cancelar al evento click para eliminar la forma
				$cancelar_plugin.bind('click',function(){
					var remove = function() {$(this).remove();};
					$('#forma-envreenv-overlay').fadeOut(remove);
				});
				
				$cerrar_plugin.bind('click',function(){
					var remove = function() {$(this).remove();};
					$('#forma-envreenv-overlay').fadeOut(remove);
					$buscar.trigger('click');
				});
                                
				
			}
		}
	}
    
    $get_datos_grid = function(){
        var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getAllReenv.json';
        
        var iu = $('#lienzo_recalculable').find('input[name=iu]').val();
        
        $arreglo = {'orderby':'id','desc':'DESC','items_por_pag':10,'pag_start':1,'display_pag':10,'input_json':'/'+controller+'/getAllReenv.json', 'cadena_busqueda':$cadena_busqueda, 'iu':iu}
        
        $.post(input_json,$arreglo,function(data){
            
            //pinta_grid
            $.fn.tablaOrdenable(data,$('#lienzo_recalculable').find('.tablesorter'),carga_formaenvreenv00_for_datagrid00);

            //resetea elastic, despues de pintar el grid y el slider
            Elastic.reset(document.getElementById('lienzo_recalculable'));
        },"json");
    }

    $get_datos_grid();
    
    
});


