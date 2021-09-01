<template>
    <div class="vertical-table">
        <div class="head" ref="head">
            <div class="column">
                <div v-for="item in tableHead" :key="item.label" class="row">
                    {{item.label}}
                    <small v-if="item.unit">{{item.unit}}</small>
                </div>
            </div>
        </div>
        <div class="body" ref="body" v-if="tableData.length>1">
            <div class="column" v-for="item in tableData" :key="item" >
                <div v-for="pro in tableHead" :key="pro.props" class="row" style="height: 20px">
                    {{item[pro.prop]}}
                </div>
            </div>
          
        </div>
          <div v-else class="nodata">
            暂无数据
        </div>
    </div>
</template>

<script>
export default {
    props:{
        //表头配置
        tableHead:{
            type:Array,
            default: function(){
                return []
            }
        },
        //数据
        tableData:{
            type:Array,
            default: function(){
                return []
            }
        },
        //一行显示的数据数量
        rowNum:{
            type:Number,
            default:4
        }
    }
}
</script>

<style lang="less" scoped>
.vertical-table{
    margin:2% 0;
    display: flex;
    justify-content: space-between;
    text-align: center;
    font-size: 14px;
    // color: @text-color-regular;
    font-weight: 400;
    line-height: 24px;
    vertical-align: middle;
    border:1px solid #999;
    .column{
        flex:1;
        min-width: 80px;
        border-right:1px solid #999;
        &:hover{
            background: #f5f7fa;
        }
        .row{
            padding:6px 0;
            text-align: center;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            vertical-align: middle;
            border-bottom:1px solid #999;
            &:last-child{
                border-bottom:none;
            }
           
        }
    }
    .head{
        display: flex;
        .column{
            min-width: 100px;
            // &:hover{
            //     background: rgb(255,255,255);
            // }
        }
    }
    .body{
        display: flex;
        overflow-x: hidden;
        &:hover{
            overflow-x: scroll;
        }
        .column{
            
            &:last-child{
                border-right:none;
            }
            // &:nth-child(even){
            //     background: rgb(250,250,250);
            // }
        }
    }
    .nodata{
         flex: 1;
         display: flex;
         justify-content: center;
         align-items: center;
     } 
}
</style>