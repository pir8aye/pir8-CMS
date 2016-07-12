  ListMenuItems = React.createClass({
  mixins:[ReactMeteorData],
  getMeteorData(){
    that=this
    var handle2 = Meteor.subscribe('menuItems',FlowRouter.getParam("_id"),that.state.trashListShow);
    var Menus = Meteor.subscribe('menus')
   return {
     MenuItemsData : PanoplyCMSCollections.MenuItems.find({mainParentId:FlowRouter.getParam("_id"),trash:that.state.trashListShow}).fetch(),
     results : PanoplyCMSCollections.MenuItems.find().fetch(),
     Menus:PanoplyCMSCollections.Menus.find({trash:false}).fetch()
      } 
    },
   getInitialState(){
    return{
      trashListShow:false
     }
    },
  
listOfMenu(){  
     var elements = this.data.MenuItemsData;
    var menu = new Array();
    var element = new Array();
    var level=0;
  elements.forEach(function (elem1) {
          if(elem1.parentId=='' || elem1.trash==true ){
            element.push({ _id: elem1._id, title: elem1.title, alias: elem1.alias, desc:elem1.desc, level:level });
             var child= getChild(elem1._id,level+1);
           }
        });
    function getChild(parent_id,level){
      elements.forEach(function (elem2) {
        if(elem2.parentId){
          if(parent_id== elem2.parentId){
              element.push({ _id: elem2._id, title: elem2.title, alias: elem2.alias, desc:elem2.desc, child: getChild(elem2._id,level+1), level:level });
          }
        }
      });
      return element;
    }
   // console.log(getElements(),'getElements()')
    return element;
  },
  showArticles(){
    if($('#display').val()=='trash'){
      Session.set("trashListShow",true);
      this.setState({trashListShow:true})
    }else{
      Session.set("trashListShow",false);
      this.setState({trashListShow:false})
    }
    
   },
   showMenu(){
     Session.set('MenuId',$('#mainMenu').val());
      FlowRouter.go('listMenuItems',{_id:$('#mainMenu').val()})
  },
   storeMenuid(event){
      event.preventDefault();
     console.log(FlowRouter.getParam("_id"),"routes")
      FlowRouter.go(''+'\addMenuItem',{_id:FlowRouter.getParam("_id")})
  },

  render() {
    that=this;
    var m =this.listOfMenu();
    return (
      <div className="col-md-10 content">
        <Heading  data={i18n('ADMIN_MENU_MENUITEMS')} />
         <div className="row">   
        <div className="panel-heading"><span className="lead"></span></div>
        <div className="panel-heading"> 
          <a  className="btn btn-success btn-ico" onClick={this.storeMenuid} ><i className="fa fa-plus-circle fa-lg "></i>&nbsp;
            {i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM')}
          </a>
           <div className="pull-right col-md-3" >
            Menus:  
            <select id="mainMenu" ref="mainMenu" onChange={this.showMenu} defaultValue={FlowRouter.getParam("_id")}>
              {this.data.Menus.map(function(result) {
                  return <option key={result._id} value={result._id} >{result.title}</option>;
                 
                })} 
            </select>
          </div>  
               <div className="pull-right col-md-3 col-md-offset-1">
                  Display: 
                  <select id="display" onChange={this.showArticles} >
                    <option value="all">All</option>
                    <option value="trash">Trash</option>
                  </select>
               </div>  
            </div>
        </div>
          <div className="table-responsive" id="non-editable">
         <table className="table table-bordered" style={{width:"90%"}} >
              <thead>
                <tr>
                  <th>{i18n('ADMIN_MENU_ADDMENU_FORM_TITLE')}</th>
                  <th>{i18n('ADMIN_MENU_ADDMENU_FORM_DESCRIPTION')}</th>
                   <th>{i18n('ADMIN_MENU_ADDMENU_FORM_ACTION')}</th>
                   {/*<th>{i18n('ADMIN_MENU_ADDMENU_FORM_EDIT')}</th>*/}
                 </tr>
              </thead>
              
               {m.map(function (menu) {
                    return  <Trvalue key={menu._id} data={menu} />         
                })} 
          
              </table>
          </div>
           {this.data.MenuItemsData.map(function(result) {
          return  <Modal key={result._id} data={result} stateVal={that.state.trashListShow} />         
            })} 
            {this.data.MenuItemsData.map(function(result) {
          return  <RestoreModal key={result._id} data={result}/>            
            })} 
        </div>    
     );
  }
});

var Trvalue = React.createClass({
  mixins:[ReactMeteorData],
  getMeteorData(){
    that=this
     Meteor.subscribe('menuParentItems',this.props.data._id,false);

 return {
     MenuItemsData : PanoplyCMSCollections.MenuItems.find({parentId:that.props.data._id,trash:false}).fetch(),
    
      } 
    },

  render: function() {
    var iconStyle={
        display:"inline-block",
        fontSize:"1.8em",
        verticalAlign:"top",
       // marginTop: "-8px"
      };
    var divStyle = {
        display: "inline-block",
      };
    var anchorStyle= {
      display:"block",
    }
    var list='|-';
    for(i=0;i<that.props.data.level;i++){
      list +='|-';
    }

    
    var c=0;
    return (
      <tbody >
       <tr>
          <td id="edit_article" style={{lineHeight: "1em",}}> <large style={iconStyle}>{list}</large><div style={divStyle}><a href="#" ><large style={anchorStyle}  > {this.props.data.title}</large> </a><small style={anchorStyle}> (<span>{'Alias:'+this.props.data.alias}</span>) </small></div></td>
          <td  >{this.props.data.desc}</td>
          
        {/*  <td id="delete_article"><div  onClick={this.deleteMenuItem} className="delete_btn"><i className="fa fa-trash-o" data-toggle="tooltip" title="Delete" ></i> </div></td>
          <td id="edit_article"><div  className="edit_btn"  id=""><a href={FlowRouter.path('editMenuItem',{_id:this.props.data._id})}><i className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit"></i></a> </div></td>*/}

          <td>
          <div  id="delete_article" className="delete_btn" data-toggle="modal" data-target={"#"+this.props.data._id} style={{display:'inline-block'}}>
              
              {
                Session.get("trashListShow") ? <i style={{color:'red'}} title="Delete" className="fa fa-times" aria-hidden="true"></i> : <i className="fa fa-trash-o"  title="Trash" ></i> 
              }
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {
              Session.get("trashListShow")? <i data-toggle="modal" data-target={'#'+this.props.data._id+'restoreArticle'} className="fa fa-archive" aria-hidden="true" onClick={this.restoreArticle} title="Restore" ></i> : <a href={FlowRouter.path('editMenuItem',{_id:this.props.data._id})}> <i className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit" ></i> </a> 
            }
            </td>


        </tr>
            </tbody>
    );
    
  }
});
Modal=React.createClass({
   deleteMenuItem(){
     if(Session.get("trashListShow")){
                     Meteor.call('deleteMenu',this.props.data._id,function(err,data){
                  console.log(err,data);
                });
      }
    else {
              event.preventDefault();
                Meteor.call('deleteMenuItem',this.props.data._id,function(err,data){
                  console.log(err,data);
                });
          } 
    },
  render:function(){
    return(
          <div id={this.props.data._id} className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Do you really want to remove ?</h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.deleteMenuItem} data-dismiss="modal">YES</button>
                  <button type="button" className="btn btn-danger" data-dismiss="modal">NO</button>
                </div>
              </div>
            </div>
          </div>
    )     
  }
})

RestoreModal=React.createClass({
   restoreMenuItem(){
        Meteor.call('restoreMenuItem',this.props.data._id,function(err,data){
           if(err){
        console.log(err)
      }else{
        console.log(data)
      }
         });
      
     },

  render:function(){
    return(
          <div id={this.props.data._id+'restoreArticle'} className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Do you really want to restore ?</h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.restoreMenuItem} data-dismiss="modal">YES</button>
                  <button type="button" className="btn btn-danger" data-dismiss="modal">NO</button>
                </div>
              </div>
            </div>
          </div>
    )     
  }
})

