var g_chipmunkScene, g_gameScene, g_resources, g_startScene, g_teachScene, key, res, value;

res = {
  HelloWorld_png: "res/HelloWorld.png",
  CloseNormal_png: "res/CloseNormal.png",
  CloseSelected_png: "res/CloseSelected.png",
  start_page_bg: "res/start_page.jpg",
  level_bg1: "res/level_bg1.png",
  level_bg2: "res/level_bg2.png",
  level_bg3: "res/level_bg3.png",
  level_cloud1: "res/level_cloud1.png",
  level_cloud2: "res/level_cloud2.png",
  level_cloud3: "res/level_cloud3.png",
  column_blue: "res/column_blue.png",
  column_brown: "res/column_brown.png",
  column_gray: "res/column_gray.png",
  column_green: "res/column_green.png",
  column_orange: "res/column_orange.png",
  column_purple: "res/column_purple.png",
  column_red: "res/column_red.png",
  column_yellow: "res/column_yellow.png",
  fly_blue: "res/fly_blue.png",
  fly_brown: "res/fly_brown.png",
  fly_gray: "res/fly_gray.png",
  fly_green: "res/fly_green.png",
  fly_orange: "res/fly_orange.png",
  fly_purple: "res/fly_purple.png",
  fly_red: "res/fly_red.png",
  fly_yellow: "res/fly_yellow.png",
  fly_blue2: "res/fly_blue2.png",
  fly_brown2: "res/fly_brown2.png",
  fly_gray2: "res/fly_gray2.png",
  fly_green2: "res/fly_green2.png",
  fly_orange2: "res/fly_orange2.png",
  fly_purple2: "res/fly_purple2.png",
  fly_red2: "res/fly_red2.png",
  fly_yellow2: "res/fly_yellow2.png",
  brick: "res/brick.png",
  start_btn: "res/start_btn.png",
  teach_btn: "res/teach_btn.png",
  rate_btn: "res/rate_btn.png",
  teach1: "res/teach1.png",
  teach2: "res/teach2.png",
  teach3: "res/teach3.png",
  teach4: "res/teach4.png",
  teach5: "res/teach5.png",
  teach6: "res/teach6.png",
  teach7: "res/teach7.png",
  teach8: "res/teach8.png",
  again_btn: "res/again_btn.png",
  share_btn: "res/share_btn.png",
  score_board: "res/score_board.png",
  font: "res/font.png",
  font_fnt: "res/font.fnt",
  weixin_arrow: "res/weixin_arrow.png",
  touch_mp3: "res/touch.MP3",
  score_mp3: "res/score.mp3",
  fly_blue_plist: "res/fly_blue.plist",
  fly_green_plist: "res/fly_green.plist",
  fly_purple_plist: "res/fly_purple.plist",
  fly_red_plist: "res/fly_red.plist",
  fly_yellow_plist: "res/fly_yellow.plist",
  brick_plist: "res/brick.plist",
  column_coll_effect: "res/column_coll_effect.png",
  column_coll_effect_plist: "res/column_coll_effect.plist",
  bianse_plist: "res/bianse.plist",
  bianse: "res/bianse.png",
  dead_plist: "res/dead.plist",
  dead_png: "res/dead.png"
};

g_resources = [];

for (key in res) {
  value = res[key];
  g_resources.push(value);
}

g_chipmunkScene = [res.fly_blue, res.column_blue];

g_startScene = [res.start_page_bg, res.start_btn, res.rate_btn, res.teach_btn];

g_teachScene = [res.teach1, res.teach2, res.teach3, res.teach4, res.teach5, res.teach6, res.teach7, res.teach8];

g_gameScene = [res.level_bg1, res.level_bg2, res.level_bg3, res.level_cloud1, res.level_cloud2, res.level_cloud3, res.column_blue, res.column_green, res.column_purple, res.column_red, res.column_yellow, res.fly_blue, res.fly_green, res.fly_purple, res.fly_red, res.fly_yellow, res.fly_blue2, res.fly_green2, res.fly_purple2, res.fly_red2, res.fly_yellow2, res.brick, res.again_btn, res.share_btn, res.score_board, res.font, res.font_fnt, res.weixin_arrow, res.touch_mp3, res.score_mp3, res.fly_blue_plist, res.fly_green_plist, res.fly_purple_plist, res.fly_red_plist, res.fly_yellow_plist, res.brick_plist, res.column_coll_effect, res.column_coll_effect_plist, res.bianse, res.bianse_plist, res.dead_png, res.dead_plist];
