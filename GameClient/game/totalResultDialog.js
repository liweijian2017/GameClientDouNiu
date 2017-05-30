/**
 * Created by Jack.L on 2017/4/13.
 */

var dialogTotalResult = cc.Sprite.extend(
    {
        BANNER_ARRAY:null,
        size:{width:SCREEN_SIZE.WIDTH, height:SCREEN_SIZE.HEIGHT},
        ctor:function()
        {
            this._super();
            this.initWithFile(res_common.COMMON_BACK);
            this.setPosition(this.size.width/2, this.size.height/2);

            var _frame_banner = cc.spriteFrameCache.getSpriteFrame("total_result_banner.png");

            var _title = cc.LabelTTF.create("总结算成绩", FONT_NAME.FONT_YOUYUAN, 72);
            _title.setPosition(this.size.width/2, this.size.height - 64);
            this.addChild(_title);

            ////////
            const _heightBase = 200;
            const _heightFlag = 120;

            const _banner_size =
                [
                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase},
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase},

                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase - _heightFlag},
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase - _heightFlag},

                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase - _heightFlag * 2 },
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase - _heightFlag * 2},

                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase - _heightFlag * 3},
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase - _heightFlag * 3},
                ];

            var FRAME_PLAYER_ICON = cc.spriteFrameCache.getSpriteFrame("person_unknown.png");
            this.BANNER_ARRAY = [];

            for( var i in _banner_size )
            {
                const _sizedata = _banner_size[i];

                ////////
                var _sptBanner = cc.Sprite.createWithSpriteFrame(_frame_banner);
                _sptBanner.setScale(0.45);
                _sptBanner.setPosition(_sizedata.x, _sizedata.y);

                this.addChild(_sptBanner);

                ////////
                var PLAYER_ICON = cc.Sprite.createWithSpriteFrame(FRAME_PLAYER_ICON);
                PLAYER_ICON.setPosition(128,128);
                _sptBanner.addChild(PLAYER_ICON);
                _sptBanner.PLAYER_ICON = PLAYER_ICON;

                var PLAYER_NAME = cc.LabelTTF.create("无人",FONT_NAME.FONT_HEITI,64);
                PLAYER_NAME.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                PLAYER_NAME.setAnchorPoint(0.0, 1.0);
                PLAYER_NAME.setPosition(256.0 + 32.0, 256.0 - 32.0);
                PLAYER_NAME.setVisible(false);

                _sptBanner.addChild(PLAYER_NAME);
                _sptBanner.PLAYER_NAME = PLAYER_NAME;

                var TOTAL_SCORE = cc.LabelTTF.create("0",FONT_NAME.FONT_HEITI,72);
                TOTAL_SCORE.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                TOTAL_SCORE.setAnchorPoint(0.0, 0.0);
                TOTAL_SCORE.setPosition(256.0 + 32.0, 32.0);
                TOTAL_SCORE.setVisible(false);

                _sptBanner.addChild(TOTAL_SCORE);
                _sptBanner.TOTAL_SCORE = TOTAL_SCORE;

                ////////
                this.BANNER_ARRAY.push(_sptBanner);

                _sptBanner.SET_PLAYER_DATA =
                    function(player_data)
                    {
                        ////////
                        this.PLAYER_NAME.setString(player_data.nickname);
                        this.PLAYER_NAME.setVisible(true);

                        ////////
                        this.TOTAL_SCORE.setString(player_data.score);
                        this.TOTAL_SCORE.setVisible(true);

                        if( player_data.score > 0 )
                        {
                            this.TOTAL_SCORE.setColor(cc.color(255,100,100));
                        }
                        else if( player_data.score < 0 )
                        {
                            this.TOTAL_SCORE.setColor(cc.color(100,255,100));
                        }

                        ////////
                        const _img_url  = player_data.img_url;
                        var   _sptObject = this.PLAYER_ICON;

                        var FUNC_IMG_LOADER =
                            function(err, img){
                                if(err) return;
                                cc.textureCache.addImage(_img_url);

                                var texture2d = new cc.Texture2D();
                                texture2d.initWithElement(img);
                                texture2d.handleLoadedTexture();
                                var sp = _sptObject;
                                sp.initWithTexture(texture2d);

                                const _flag_w = 220 / sp.getContentSize().width;
                                const _flag_h = 220 / sp.getContentSize().height;

                                sp.setScale(_flag_w, _flag_h);

                            };

                        cc.loader.loadImg(_img_url, {isCrossOrigin:true }, FUNC_IMG_LOADER);
                    };
            }

            ////////
            var _frame_buttonConfirm = cc.spriteFrameCache.getSpriteFrame("button_confirm.png");
            var _buttonConfirm =
                new uiTouchSprite(
                    null,null,
                    function (touch, event) {
                        var _trans = new cc.TransitionCrossFade(1.0, new sceneHall());
                        cc.director.runScene(_trans);
                    }
                );

            _buttonConfirm.initWithSpriteFrame(_frame_buttonConfirm);
            _buttonConfirm.setPosition(this.size.width/2, 64.0);
            _buttonConfirm.setScale(0.625, 0.625);
            this.addChild(_buttonConfirm);

            ////////
            this.show(false);
        },
        setPlayerData:function(player_data, pos)
        {
            this.BANNER_ARRAY[pos].SET_PLAYER_DATA(player_data);
        },
        show:function(_isShow)
        {
            if( _isShow )
            {
                ////////
                var PLAYERS = clientSystem.getInstance().OTHER_PLAYERS;

                for( var i in PLAYERS )
                {
                    var _player = PLAYERS[i];
                    this.setPlayerData(_player, i);
                }

                this.setVisible(true);
            }
            else
            {
                this.setVisible(false);
            }
        }
    }
);



