'use strict';

var loadPromotions = require("./promotions.js");
var loadAllItems = require("./items.js");

function bestCharge(selectedItems) {

  //添加订餐明细
  var result = "============= 订餐明细 =============\n";
  var line = "-----------------------------------\n";
  //加载菜品，获取菜品价格
  var items = loadAllItems();
  //加载优惠方式
  var promotions = loadPromotions();

  var meal = [];            //订单
  var element = {};         //订单单项

  //对输入进行解析，提取出其中的菜品和数量
  //输入实例：inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];selectedItems
  for (let i = 0; i < selectedItems.length; i++) {
    let itemPos = selectedItems[i].search(/ x /g);
    element = {
      id: selectedItems[i].substr(0, itemPos),
      count: parseInt(selectedItems[i].substr(itemPos + 3))
    };
    //查找该id所对应得菜，返回数组
    let dish = items.filter((item) => item.id == element.id);
    element.name = dish[0].name;
    element.price = dish[0].price;
    meal.push(element);
  }

  var mealDetail = "";
  var mealTotalPrice = 0;                                   //订单总价
  for (let j = 0; j < meal.length; j++) {
    let mealPrice = meal[j].count * meal[j].price;          //单项总价
    mealTotalPrice += mealPrice;
    let tempStr = meal[j].name + " x " + meal[j].count.toString() + " = " + mealPrice.toString() + "元\n";
    mealDetail += tempStr;
  }
  result = result + mealDetail + line;
  //console.log(meal);

  var promotionsDetail = "";        //优惠信息
  var promotionPrice = 0;           //优惠价格

  //第一步判断是否有优惠1
  var firstPromotion = 0;
  var firstPro = false;
  if(mealTotalPrice > 30)
  {
    firstPromotion = 6;
    firstPro = true;
  }

  //第二步判断是否有优惠2
  var secondPromotion = 0;
  var secondPro = false;

  var DetailItem = "";

  for(let k = 0; k < promotions[1].items.length; k++)
  {
    let singleitem = meal.filter((item) => item.id == promotions[1].items[k]);
    
    if(singleitem.length != 0)
    {
      //console.log(singleitem);
      singleitem[0].price /= 2;
      secondPromotion += singleitem[0].price * singleitem[0].count;
      DetailItem += singleitem[0].name + "，";
      secondPro = true;
    }
  }
  //通过计算总价，选择最佳优惠，并输出优惠价钱
  if(firstPro || secondPro)                   //如果优惠存在
  {
    promotionsDetail = "使用优惠:\n";
    if(firstPromotion < secondPromotion)    //如果优惠1小于优惠2
    {
      promotionPrice = secondPromotion;
      promotionsDetail += "指定菜品半价(" + DetailItem.substr(0, (DetailItem.length - 1)) + ")，省" + promotionPrice.toString() +"元\n";
    } 
    else      //如果优惠1大于或等于优惠2
    {
      promotionPrice = firstPromotion;
      promotionsDetail += "满30减6元，省" + promotionPrice.toString() +"元\n";
    }
    promotionsDetail += line;

  }
    result += promotionsDetail;

  var totalPrice = mealTotalPrice - promotionPrice;
  var totalPriceStr = "总计：" + totalPrice.toString() + "元\n";
  result += totalPriceStr;

  var sufstr = "===================================\n";
  result += sufstr;
  return result;
}

module.exports = bestCharge;
