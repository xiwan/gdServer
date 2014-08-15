package Conf;

use strict;
use warnings;
use Time::Local;

# regexpがあれば、それでマッチング。マッチしない場合はdefaultへ
# mappingがあれば、値を変換する、mappingがあるのに変換できない場合はdefaultへ
# regexp/mappingは排他的。
# filterがあれば、変換用の関数を呼び出す。1引数1返り値。
our $COLUMN_TYPE = {
	decimal => {
		default => undef,
		regexp => '\d+',
	},
	decimal_not_null => {
		default => 0,
		regexp => '\d+',
	},
	float => {
		default => 0.0,
		regexp => '\d+(\.\d+)?',
		filter => sub {
			my $value = $_[0];
			if (defined $value) {
				$value =~ s/^0+/0/o;
				$value =~ s/\.0+$//o;
			}
			$value;
		},
	},
	string => {
		default => '',
	},
	string_or_null => {
		default => undef,
	},
	date => {
        default => 0,
		regexp => '\d{4}.\d{2}.\d{2} \d{2}:\d{2}',
		filter => sub {
			my ($str, $record) = @_;
            return 0 unless($str);
			$str =~ s{(\d{4}).(\d{1,2}).(\d{1,2}) (\d{1,2}):(\d{1,2})(:\d{1,2})?} {
				int(timelocal($6,$5,$4,$3,$2-1,$1));
			}egs;
			$str;
		},
	},
    yes_no => {
        mapping => +{
            no  => 0,
            yes => 1,
        },
    },
# BB特有型
	rarity => {
		mapping => +{
			common => 1,
			uncommon => 2,
			rare => 3,
			'epic' => 4,
			'legendary' => 5,
		},
	},
	sex_type => {
		mapping => +{
			male => 1,
			female => 2,
			other => 3,
		},
	},
	race_type => {
		mapping => +{
			none => 0,
			Paragon => 1,
			Highlander => 2,
			Westerner => 3,
			Ape => 4,
			Dwarf => 5,
			Champion => 6,
			Darklander => 7,
			Easterner => 8,
			Lizardman => 9,
			Goblin => 10,
			Wight => 11,
			Undead => 12,
		},
	},
	card_type => {
		mapping => +{
			normal => 1,
			my => 2,
			boost => 3,
			special => 4,
            mount => 5,
		},
	},
	growth_type => {
		mapping => +{
			normal => 1,
			early => 2,
			late => 3,
			player => 11,
		},
	},
	skill_calc_type => {
		default => 0,
		mapping => +{
			atk     => 1,
			wiz     => 2,
			agi     => 3,
			heal    => 4,
		},
	},
	skill_func => {
		default => 0,
		mapping => +{
			Buff           => 1,
			DeBuff         => 2,
			Attack         => 3,
			Indirect       => 4,
			Coop           => 5,
			Revive         => 6,
			Kill           => 7,
			Steal          => 8,
			Charge         => 9,
			Hug            => 10,
			Drain          => 11,
			Protect        => 12,
			Counter        => 13,
			ProtectCounter => 14,
			TreasureHunter => 15,
			ClearBuff      => 16,
			Suicide        => 17,
			Heal           => 18,
			Affliction     => 19,
			Patience       => 20,
			DeBuffAttack   => 21,
			DeBuffIndirect => 22,
		},
	},
	skill_range => {
		default => 0,
		mapping => +{
			EitherSide          => 1,
			BothSides           => 2,
			SelfBothSides       => 3,
			All                 => 4,
			EnemySingle         => 5,
			EnemyDouble         => 6,
			EnemyTriple         => 7,
			EnemyAll            => 8,
			EnemyFront          => 9,
			EnemyCenter         => 10,
			EnemyRear           => 11,
            EnemyFrontAll       => 12,
			EnemyCenterAll      => 13,
			EnemyRearAll        => 14,
			EnemyFrontCenterAll => 15,
			EnemyRandom3        => 16,
			EnemyRandom6        => 17,
			EnemyRearRandom3    => 18,
			EnemyRandom4        => 19,
			EnemyRandom5        => 20,
			MySelf              => 21,
			Everyone            => 22,
			EnemyRandom2        => 23,
		},
	},
	skill_type => {
		mapping => +{
			startup         => 1,
			attack          => 2,
			defence         => 3,
			field           => 4,
			protect         => 5,
		},
	},
	form_order => {
		mapping => +{
			none    => 0,
			forward => 1,
			middle  => 2,
			back    => 3,
		},
	},
	payment_type => {
		mapping => +{
			MobaCoin    => 1,
			GameMoney   => 1,
		},
	},
    pvp_win_incentive_type => {
        mapping => +{
            normal      => 0,
            consecutive => 1,
        },
    },
	device => {
		mapping => +{
			all => 0,
			android => 1,
			ios => 2,
		},
	},
};

# シート毎各カラムの型とMySQLのカラム名、必須かどうか、IDかどうか
# 順番は保証したいためARRAY、適宜HASHにする。
our $SHEET_MAPPING = [
	'level' => {
		column_mapping => [
			'level' => { type => 'decimal', id => 1 },
			'exp' => { type => 'decimal' },
			'max_friend' => { type => 'decimal'},
		],
	},
	'card' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'name' => { type => 'string' },
			'comment' => { type => 'string'},
			'rarity' => { type => 'rarity' },
			'sex_type' => { type => 'sex_type'},
			'race_type1' => { type => 'race_type' },
			'race_type2' => { type => 'race_type' },
			'card_type' => { type => 'card_type' },
			'capture_probability' => { type => 'decimal'},
			'max_level' => { type => 'decimal'},
			'battle_exp' => { type => 'decimal'},
			'price' => { type => 'decimal'},
			'base_hp' => { type => 'decimal' },
			'base_atk' => { type => 'decimal' },
			'base_def' => { type => 'decimal' },
			'base_wis' => { type => 'decimal' },
			'base_agi' => { type => 'decimal' },
			'max_hp' => { type => 'decimal' },
			'max_atk' => { type => 'decimal' },
			'max_def' => { type => 'decimal' },
			'max_wis' => { type => 'decimal' },
			'max_agi' => { type => 'decimal' },
			'growth_type' => { type => 'growth_type'},
			'skill_id1' => { type => 'decimal_not_null' }, # TODO: 専用の型を設けてスキル名で記述できるように
			'skill_id2' => { type => 'decimal_not_null' }, # TODO: 専用の型を設けてスキル名で記述できるように
			'skill_id3' => { type => 'decimal_not_null' }, # TODO: 専用の型を設けてスキル名で記述できるように
            'material_exp' => { type => 'decimal' },
            'has_boss_image' => { type => 'yes_no' },
            'evolution'     => { type => 'decimal' },
            'max_evolution' => { type => 'decimal' },
			'can_trade' => { type => 'decimal' },
		],
	},
	'card_level' => {
		column_mapping => [
			'level' => { type => 'decimal' },
			'exp' => { type => 'decimal' },
		],
	},
	'card_growth_mapping' => {
		column_mapping => [
			'type' => { type => 'growth_type' },
			'level' => { type => 'decimal' },
			'curve' => { type => 'decimal' },
		],
	},
	'skill' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1  },
			'rarity' => { type => 'decimal' },
			'skill_type' => { type => 'skill_type' },
			'name' => { type => 'string' },
			'comment' => { type => 'string' },
			'skill_func' => { type => 'skill_func' },
			'skill_calc_type' => { type => 'skill_calc_type' },
			'skill_func_arg1' => { type => 'float' },
			'skill_func_arg2' => { type => 'float' },
			'skill_func_arg3' => { type => 'float' },
			'skill_func_arg4' => { type => 'float' },
			'skill_range' => { type => 'skill_range' },
			'caster_effect_id' => { type => 'decimal_not_null' },
			'target_effect_id' => { type => 'decimal_not_null' },
			'caster_se' => { type => 'string' },
			'target_se' => { type => 'string' },
			'target_player_se' => { type => 'string' },
			'base_probability' => { type => 'decimal' },
			'max_probability' => { type => 'decimal' },
		],
	},
	'skill_level' => {
		column_mapping => [
			'level' => { type => 'decimal', id => 1 },
			'rarity' => { type => 'decimal' },
			'exp' => { type => 'decimal' },
			'cost_money' => { type => 'decimal' },
		],
	},
	'formation' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'name' => { type => 'string' },
			'comment' => { type => 'string' },
			'max_num' => { type => 'decimal' },
			'reserve_num' => { type => 'decimal' },
			'order1' => { type => 'form_order' },
			'order2' => { type => 'form_order' },
			'order3' => { type => 'form_order' },
			'order4' => { type => 'form_order' },
			'order5' => { type => 'form_order' },
		],
	},
	'region' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'name' => { type => 'string' },
			'comment' => { type => 'string' },
			'image' => { type => 'decimal_not_null' },
			'sx' => { type => 'decimal_not_null' },
			'sy' => { type => 'decimal_not_null' },
		],
	},
	'area' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'name' => { type => 'string' },
			'comment' => { type => 'string' },
			'region_id' => { type => 'decimal' },
			'start_zone_id' => { type => 'decimal' },
			'zone_num' => { type => 'decimal' },
			'release_area_id' => { type => 'decimal_not_null' },
			'release_region_id' => { type => 'decimal_not_null' },
            'release_formation_id' => { type => 'decimal_not_null' },
            'release_max_card' => { type => 'decimal_not_null' },
			'image' => { type => 'decimal_not_null' },
			'sx' => { type => 'decimal_not_null' },
			'sy' => { type => 'decimal_not_null' },
			'wx' => { type => 'decimal_not_null' },
			'wy' => { type => 'decimal_not_null' },
			'event_id' => { type => 'decimal_not_null' },
		],
	},
	'zone' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'zone_no' => { type => 'decimal' },
			'area_id' => { type => 'decimal' },
			'next_zone_id' => { type => 'decimal_not_null' },
			'bgm_id' => { type => 'decimal' },
			'event_id' => { type => 'decimal' },
		],
	},
	'zone_data' => {
		column_mapping => [
			'zone_id' => { type => 'decimal', zone_id => 1 },
			'bag_money' => { type => 'decimal' },
			'large_bag_money' => { type => 'decimal' },
			'normal_treasure_money' => { type => 'decimal_not_null' },
			'rare_treasure_money' => { type => 'decimal_not_null' },
			'super_rare_treasure_money' => { type => 'decimal_not_null' },
			'reward_id' => { type => 'decimal_not_null' },
			'enemy_party_id1' => { type => 'decimal_not_null' },
			'enemy_party_id2' => { type => 'decimal_not_null' },
			'enemy_party_id3' => { type => 'decimal_not_null' },
			'enemy_party_id4' => { type => 'decimal_not_null' },
			'enemy_probability1' => { type => 'decimal_not_null' },
			'enemy_probability2' => { type => 'decimal_not_null' },
			'enemy_probability3' => { type => 'decimal_not_null' },
			'enemy_probability4' => { type => 'decimal_not_null' },
			'strong_enemy_party_id1' => { type => 'decimal_not_null' },
			'strong_enemy_party_id2' => { type => 'decimal_not_null' },
			'strong_enemy_party_id3' => { type => 'decimal_not_null' },
			'strong_enemy_party_id4' => { type => 'decimal_not_null' },
			'strong_enemy_probability1' => { type => 'decimal_not_null' },
			'strong_enemy_probability2' => { type => 'decimal_not_null' },
			'strong_enemy_probability3' => { type => 'decimal_not_null' },
			'strong_enemy_probability4' => { type => 'decimal_not_null' },
			'default_step_probability_id' => { type => 'decimal_not_null' },
			'category_a' => { type => 'decimal_not_null' },
			'category_b' => { type => 'decimal_not_null' },
			'category_c' => { type => 'decimal_not_null' },
			'category_d' => { type => 'decimal_not_null' },
			'category_e' => { type => 'decimal_not_null' },
			'category_f' => { type => 'decimal_not_null' },
			'category_g' => { type => 'decimal_not_null' },
			'category_h' => { type => 'decimal_not_null' },
		],
	},
	'zone_reward' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'first_reward1' => { type => 'decimal_not_null' },
			'first_reward_num1' => { type => 'decimal_not_null' },
			'first_reward2' => { type => 'decimal_not_null' },
			'first_reward_num2' => { type => 'decimal_not_null' },
			'first_reward3' => { type => 'decimal_not_null' },
			'first_reward_num3' => { type => 'decimal_not_null' },
			'reward1' => { type => 'decimal_not_null' },
			'reward_num1' => { type => 'decimal_not_null' },
			'reward2' => { type => 'decimal_not_null' },
			'reward_num2' => { type => 'decimal_not_null' },
			'reward3' => { type => 'decimal_not_null' },
			'reward_num3' => { type => 'decimal_not_null' },
			'rare_item_id1' => { type => 'decimal_not_null' },
			'rare_item_id2' => { type => 'decimal_not_null' },
			'rare_item_id3' => { type => 'decimal_not_null' },
			'rare_item_id4' => { type => 'decimal_not_null' },
			'rare_probability1' => { type => 'decimal_not_null' },
			'rare_probability2' => { type => 'decimal_not_null' },
			'rare_probability3' => { type => 'decimal_not_null' },
			'rare_probability4' => { type => 'decimal_not_null' },
			'super_rare_item_id1' => { type => 'decimal_not_null' },
			'super_rare_item_id2' => { type => 'decimal_not_null' },
			'super_rare_item_id3' => { type => 'decimal_not_null' },
			'super_rare_item_id4' => { type => 'decimal_not_null' },
			'super_rare_probability1' => { type => 'decimal_not_null' },
			'super_rare_probability2' => { type => 'decimal_not_null' },
			'super_rare_probability3' => { type => 'decimal_not_null' },
			'super_rare_probability4' => { type => 'decimal_not_null' },
		],
	},
	'step_probability' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'probability_normal' => { type => 'decimal_not_null' },
			'probability_rare' => { type => 'decimal_not_null' },
			'probability_super_rare' => { type => 'decimal_not_null' },
			'probability_enemy' => { type => 'decimal_not_null' },
			'probability_strong_enemy' => { type => 'decimal_not_null' },
			'probability_bag' => { type => 'decimal_not_null' },
			'probability_large_bag' => { type => 'decimal_not_null' },
			'probability_friend' => { type => 'decimal_not_null' },
			'probability_raid_boss' => { type => 'decimal_not_null' },
			'probability_pvp' => { type => 'decimal_not_null' },
			'normal_item_id1' => { type => 'decimal_not_null' },
			'normal_item_id2' => { type => 'decimal_not_null' },
			'normal_item_id3' => { type => 'decimal_not_null' },
			'normal_item_id4' => { type => 'decimal_not_null' },
			'normal_probability1' => { type => 'decimal_not_null' },
			'normal_probability2' => { type => 'decimal_not_null' },
			'normal_probability3' => { type => 'decimal_not_null' },
			'normal_probability4' => { type => 'decimal_not_null' },
		],
	},
	'enemy_party' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'formation_id' => { type => 'decimal' },
			'zone_id' => { type => 'decimal' },
			'leader_index' => { type => 'decimal' },
			'card_id1' => { type => 'decimal_not_null' },
			'card_id2' => { type => 'decimal_not_null' },
			'card_id3' => { type => 'decimal_not_null' },
			'card_id4' => { type => 'decimal_not_null' },
			'card_id5' => { type => 'decimal_not_null' },
			'card_level1' => { type => 'decimal_not_null' },
			'card_level2' => { type => 'decimal_not_null' },
			'card_level3' => { type => 'decimal_not_null' },
			'card_level4' => { type => 'decimal_not_null' },
			'card_level5' => { type => 'decimal_not_null' },
			'skill_level1' => { type => 'decimal_not_null' },
			'skill_level2' => { type => 'decimal_not_null' },
			'skill_level3' => { type => 'decimal_not_null' },
			'skill_level4' => { type => 'decimal_not_null' },
			'skill_level5' => { type => 'decimal_not_null' },
		],
	},
	'item' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'name' => { type => 'string' },
			'comment' => { type => 'string'},
			'can_trade' => { type => 'decimal' },
			'trade_point' => { type => 'float' },
		],
	},
	'shop' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'item_id' => { type => 'decimal' },
			'price' => { type => 'decimal' },
			'payment_type' => { type => 'payment_type' },
			'num' => { type => 'decimal' },
			'opened_at' => { type => 'date' },
			'closed_at' => { type => 'date' },
			'name' => { type => 'string' },
			'comment' => { type => 'string'},
			'title' => { type => 'string' },
			'set_items' => { type => 'string' },
			'num_per_today' => { type => 'decimal_not_null' },
			'max_buy_num' => { type => 'decimal_not_null' },
			'display_order' => { type => 'decimal_not_null' },
		],
	},
	'gacha' => {
		column_mapping => [
			'id' => { type => 'decimal', id => 1 },
			'name' => { type => 'string' },
			'comment' => { type => 'string'},
			'payment_type' => { type => 'decimal' },
			'item_id' => { type => 'decimal' },
			'price' => { type => 'decimal' },
			'ten_price' => { type => 'decimal' },
			'item_id' => { type => 'decimal' },
			'display_order' => { type => 'decimal' },
			'opened_at' => { type => 'date' },
			'closed_at' => { type => 'date' },
            'max_draw_num' => { type => 'decimal' },
            'show_card_rule' => { type => 'string' },
			'epic_bonus_opened_at' => { type => 'date' },
			'epic_bonus_closed_at' => { type => 'date' },
            'event_id' => { type => 'decimal_not_null' },
            'is_count_down' => { type => 'decimal_not_null' },
            'num1' => { type => 'decimal_not_null' },
            'num2' => { type => 'decimal_not_null' },
            'price1' => { type => 'decimal_not_null' },
            'price2' => { type => 'decimal_not_null' },
            'banner_id' => { type => 'decimal_not_null' },
            'epic_bonus_banner_id' => { type => 'decimal_not_null' },
            'info' => { type => 'string' },
            'epic_bonus_card_ids' => { type => 'string' },
            'step_up_id' => { type => 'decimal_not_null'},
            'step_up_num' => { type => 'decimal_not_null'},
            'is_retry' => { type => 'decimal_not_null'},
            'alert_text' => { type => 'string' },
		],
	},
	'gacha_probability' => {
		column_mapping => [
			'gacha_id' => { type => 'decimal', id => 1 },
			'card_id' => { type => 'string' },
			'probability' => { type => 'decimal_not_null'},
		],
	},
    'gift' => {
        column_mapping => [
        'id' => { type => 'decimal', id => 1 },
        'type' => { type => 'decimal'},
        'object_id' => { type => 'decimal' },
        'value' => { type => 'decimal'},
        ],
    },
    'login_bonus' => {
        column_mapping => [
        'id'        => { type => 'decimal', id => 1 },
        'name'      => { type => 'string' },
        'comment'   => { type => 'string' },
        'opened_at' => { type => 'date' },
        'closed_at' => { type => 'date' },
        ],
    },
    'notice' => {
        column_mapping => [
        'id'        => { type => 'decimal', id => 1 },
        'comment'      => { type => 'string' },
        'notice_type'   => { type => 'decimal' },
        'ignore_newuser' => { type => 'decimal' },
        'target_device' => { type => 'decimal' },
        'link_type' => { type => 'decimal' },
        'link_body' => { type => 'string' },
        'banner_id' => { type => 'decimal_not_null' },
        'banner_order' => { type => 'decimal_not_null' },
        'is_popup' => { type => 'decimal_not_null' },
        'start_at' => { type => 'date' },
        'end_at' => { type => 'date' },
        'created_at' => { type => 'date' },
        'updated_at' => { type => 'date' },
        ],
    },
    'login_bonus_reward' => {
        column_mapping => [
        'id'             => { type => 'decimal', id => 1 },
        'day'            => { type => 'decimal' },
        'login_bonus_id' => { type => 'decimal' },
        'object_type'    => { type => 'decimal' },
        'object_id'      => { type => 'decimal' },
        'value'          => { type => 'decimal' },
        ],
    },
    'event_data' => {
        column_mapping => [
        'id'             => { type => 'decimal', id => 1 },
        'event_type'     => { type => 'decimal' },
        'name'           => { type => 'string' },
        'description'    => { type => 'string' },
        'leaderboard_id'     => { type => 'string' },
        'target_device'  => { type => 'decimal' },
        'start_zone_id'  => { type => 'decimal' },
        'started_at'     => { type => 'date' },
        'ended_at'       => { type => 'date' },
        'finished_at'    => { type => 'date' },
        ]
    },
    'enemy_parameter' => {
        column_mapping => [
        'enemy_party_id' => { type => 'decimal' },
        'card_id' => { type => 'decimal' },
        'level' => { type => 'decimal_not_null' },
        'hp' => { type => 'decimal_not_null' },
        'atk' => { type => 'decimal_not_null' },
        'def' => { type => 'decimal_not_null' },
        'wis' => { type => 'decimal_not_null' },
        'agi' => { type => 'decimal_not_null' },
        'skill_id1' => { type => 'decimal_not_null' },
        'skill_id2' => { type => 'decimal_not_null' },
        'skill_id3' => { type => 'decimal_not_null' },
        'skill_probability1' => { type => 'decimal_not_null' },
        'skill_probability2' => { type => 'decimal_not_null' },
        'skill_probability3' => { type => 'decimal_not_null' },
        'battle_exp' => { type => 'decimal_not_null' },
        ],
    },
    'sns_invite_campaign_master' => {
        column_mapping => [
        'campaign_id'   => { type => 'decimal', id => 1 },
        'campaign_name' => { type => 'string' },
        'start_date'    => { type => 'date' },
        'end_date'      => { type => 'date' },
        ],
    },
    'sns_invite_present_master' => {
        column_mapping => [
        'campaign_id'   => { type => 'decimal', id => 1 },
        'invited_cnt'   => { type => 'decimal' },
        'comment'       => { type => 'string' },
        'display'       => { type => 'decimal' },
        'object_type1'  => { type => 'decimal' },
        'object_id1'    => { type => 'decimal' },
        'object_value1' => { type => 'decimal' },
        'object_type2'  => { type => 'decimal' },
        'object_id2'    => { type => 'decimal' },
        'object_value2' => { type => 'decimal' },
        'object_type3'  => { type => 'decimal' },
        'object_id3'    => { type => 'decimal' },
        'object_value3' => { type => 'decimal' },
        'object_type4'  => { type => 'decimal' },
        'object_id4'    => { type => 'decimal' },
        'object_value4' => { type => 'decimal' },
        'object_type5'  => { type => 'decimal' },
        'object_id5'    => { type => 'decimal' },
        'object_value5' => { type => 'decimal' },
        ],
    },
    'sns_share_campaign_master' => {
        column_mapping => [
        'campaign_id'   => { type => 'decimal', id => 1 },
        'campaign_name' => { type => 'string' },
        'start_date'    => { type => 'date' },
        'end_date'      => { type => 'date' },
        ],
    },
    'sns_share_present_master' => {
        column_mapping => [
        'campaign_id'   => { type => 'decimal', id => 1 },
        'shared_cnt'    => { type => 'decimal' },
        'comment'       => { type => 'string' },
        'object_type1'  => { type => 'decimal' },
        'object_id1'    => { type => 'decimal' },
        'object_value1' => { type => 'decimal' },
        'object_type2'  => { type => 'decimal' },
        'object_id2'    => { type => 'decimal' },
        'object_value2' => { type => 'decimal' },
        'object_type3'  => { type => 'decimal' },
        'object_id3'    => { type => 'decimal' },
        'object_value3' => { type => 'decimal' },
        'object_type4'  => { type => 'decimal' },
        'object_id4'    => { type => 'decimal' },
        'object_value4' => { type => 'decimal' },
        'object_type5'  => { type => 'decimal' },
        'object_id5'    => { type => 'decimal' },
        'object_value5' => { type => 'decimal' },
        ],
    },
    'event_raid_boss' => {
        column_mapping => [
        'id'                   => { type => 'decimal', id => 1 },
        'event_id'             => { type => 'decimal' },
        'card_id'              => { type => 'decimal' },
        'name'                 => { type => 'string' },
        'short_name'           => { type => 'string' },
        'expire_time'          => { type => 'decimal' },
        'max_request_step_num' => { type => 'decimal' },
        'request_user_num'     => { type => 'decimal' },
        'join_bonus_user_num'  => { type => 'decimal' },
        'mvp_point_factor'     => { type => 'float' },
        'semi_mvp_point_factor' => { type => 'float' },
        'join_bonus_point_factor' => { type => 'float' },
        'interrupt_probability' => { type => 'float' },
        'level'                => { type => 'decimal' },
        'rarity'               => { type => 'decimal' },
        'hp'                   => { type => 'decimal' },
        'atk'                  => { type => 'decimal' },
        'def'                  => { type => 'decimal' },
        'wis'                  => { type => 'decimal' },
        'agi'                  => { type => 'decimal' },
        'skill_id1'            => { type => 'decimal_not_null' },
        'skill_id2'            => { type => 'decimal_not_null' },
        'skill_id3'            => { type => 'decimal_not_null' },
        'skill_level1'         => { type => 'decimal_not_null' },
        'skill_level2'         => { type => 'decimal_not_null' },
        'skill_level3'         => { type => 'decimal_not_null' },
        'incentive_point'      => { type => 'decimal' },
        'damage_point'         => { type => 'decimal' },
        'join_gift_id'         => { type => 'decimal' },
        'first_gift_id'        => { type => 'decimal' },
        'defeat_gift_id'       => { type => 'decimal' },
        'mvp_gift_id'          => { type => 'decimal' },
        'bg_img'               => { type => 'string' },
        ]
    },

    'event_point_incentive' => {
        column_mapping => [
        'event_id'       => { type => 'decimal' },
        'point'          => { type => 'decimal'},
        'gift_id'        => { type => 'decimal' },
        'incentive_type' => { type => 'decimal' },
        ]
    },

    'event_raid_boss_probability' => {
        column_mapping   => [
        'event_id'       => { type => 'decimal' },
        'point'          => { type => 'decimal'},
        'raid_boss_id'   => { type => 'decimal' },
        'probability'    => { type => 'float' },
        ]
    },
    'event_card' => {
        column_mapping   => [
        'event_id'       => { type => 'decimal' },
        'card_id'        => { type => 'decimal'},
        'factor'         => { type => 'float' },
        'extra_factor'   => { type => 'float' },
        'event_zone_battle_factor' => { type => 'float' },
        ]
    },
    'event_enemy_level_mapping' => {
        column_mapping   => [
        'event_id'       => { type => 'decimal' },
        'level'        => { type => 'decimal'},
        'enemy_common_level'        => { type => 'decimal'},
        'enemy_uncommon_level'        => { type => 'decimal'},
        'enemy_rare_level'        => { type => 'decimal'},
        'enemy_epic_level'        => { type => 'decimal'},
        'enemy_legendary_level'        => { type => 'decimal'},
        'enemy_common_skill_level'        => { type => 'decimal'},
        'enemy_uncommon_skill_level'        => { type => 'decimal'},
        'enemy_rare_skill_level'        => { type => 'decimal'},
        'enemy_epic_skill_level'        => { type => 'decimal'},
        'enemy_legendary_skill_level'        => { type => 'decimal'},
        ]
    },
    'event_raid_boss_schedule' => {
        column_mapping   => [
        'id'             => { type => 'decimal'},
        'event_id'       => { type => 'decimal' },
        'raid_boss_id'   => { type => 'decimal'},
        'probability'    => { type => 'float'},
        'started_at'     => { type => 'date' },
        'ended_at'       => { type => 'date' },
        'notice_started_at'     => { type => 'date' }
        ]
    },
    'card_evolution' => {
        column_mapping => [
        'evolution_id'    => { type => 'decimal' },
        'master_card_id'  => { type => 'decimal' },
        'evolver_card_id' => { type => 'decimal' },
        'after_card_id'   => { type => 'decimal' },
        ]
    },
    'card_evolution_cost' => {
        column_mapping => [
        'master_card_rarity'  => { type => 'rarity' },
        'evolver_card_rarity' => { type => 'rarity' },
        'cost'                => { type => 'decimal' },
        ]
    },
    'event_enemy_point' => {
        column_mapping   => [
        'event_id'       => { type => 'decimal' },
        'card_id'        => { type => 'decimal' },
        'kill_point'     => { type => 'decimal' },
        'capture_bonus'  => { type => 'decimal' },
        ]
    },
    'pvp_win_incentive' => {
        column_mapping   => [
        'type'           => { type => 'pvp_win_incentive_type'},
        'win_count'      => { type => 'decimal' },
        'gift_id'        => { type => 'decimal' },
        ]
    },
    'pvp_ranking_incentive' => {
        column_mapping   => [
        'rank_from'      => { type => 'decimal' },
        'rank_to'        => { type => 'decimal' },
        'day_type'       => { type => 'decimal' },
        'gift_id'        => { type => 'decimal' },
        ]
    },
    'constant' => {
        column_mapping   => [
        'keyname'      => { type => 'string' },
        'value'        => { type => 'string' }
        ]
    },
    'event_card_combo_bonus' => {
        column_mapping   => [
        'event_id'  => { type => 'decimal' },
        'card_id'   => { type => 'decimal'},
        'num'       => { type => 'decimal' },
        'factor'    => { type => 'float' },
        ]
    },
    'event_ally_bonus' => {
        column_mapping   => [
        'event_id'  => { type => 'decimal' },
        'num'       => { type => 'decimal' },
        'factor'    => { type => 'float' },
        ]
    },
    'pvp_title' => {
        column_mapping   => [
        'id'  => { type => 'decimal', id => 1 },
        'name' => { type => 'string' },
        'battle_factor'    => { type => 'float' },
        ]
    },
    'pvp_target_search_factor' => {
        column_mapping => [
            'win_count' => { type => 'decimal' },
            'factor'    => { type => 'float' },
        ]
    },
    'event_pvp_title' => {
        column_mapping   => [
        'event_id'  => { type => 'decimal' },
        'title_id'  => { type => 'decimal' },
        'point'    => { type => 'decimal' },
        'incentive_point'    => { type => 'decimal' },
        'is_group'    => { type => 'decimal' },
        ]
    },
    'event_pvp_win_factor' => {
        column_mapping   => [
        'event_id'  => { type => 'decimal' },
        'win_count' => { type => 'decimal' },
        'factor'  => { type => 'decimal' },
        ]
    },
    'event_pvp_win_incentive' => {
        column_mapping   => [
        'event_id'       => { type => 'decimal_not_null' },
        'type'           => { type => 'pvp_win_incentive_type'},
        'win_count'      => { type => 'decimal' },
        'gift_id'        => { type => 'decimal' },
        ]
    },
	'event_step_probability' => {
		column_mapping => [
			'event_id' => { type => 'decimal', id => 1 },
			'step_probability_id' => { type => 'decimal', id => 1 },
			'probability_normal' => { type => 'decimal_not_null' },
			'probability_rare' => { type => 'decimal_not_null' },
			'probability_super_rare' => { type => 'decimal_not_null' },
			'probability_enemy' => { type => 'decimal_not_null' },
			'probability_strong_enemy' => { type => 'decimal_not_null' },
			'probability_bag' => { type => 'decimal_not_null' },
			'probability_large_bag' => { type => 'decimal_not_null' },
			'probability_friend' => { type => 'decimal_not_null' },
			'probability_raid_boss' => { type => 'decimal_not_null' },
			'probability_pvp' => { type => 'decimal_not_null' },
			'normal_item_id1' => { type => 'decimal_not_null' },
			'normal_item_id2' => { type => 'decimal_not_null' },
			'normal_item_id3' => { type => 'decimal_not_null' },
			'normal_item_id4' => { type => 'decimal_not_null' },
			'normal_probability1' => { type => 'decimal_not_null' },
			'normal_probability2' => { type => 'decimal_not_null' },
			'normal_probability3' => { type => 'decimal_not_null' },
			'normal_probability4' => { type => 'decimal_not_null' },
		],
	},
    'event_pvp_group_term' => {
        column_mapping   => [
        'id'         => { type => 'decimal', id => 1 },
        'event_id'   => { type => 'decimal' },
        'started_at' => { type => 'date' },
        'ended_at'   => { type => 'date' },
        'finished_at'   => { type => 'date' },
        ]
    },

    'event_pvp_graded_user_num' => {
        column_mapping => [
        'term_id'         => { type => 'decimal', id => 1 },
        'title_id'        => { type => 'decimal' },
        'group_point'     => { type => 'decimal' },
        'two_up_user_num' => { type => 'decimal' },
        'up_user_num'     => { type => 'decimal' },
        'down_user_num'   => { type => 'decimal' },
        ]
    },

    'event_pvp_group_incentive' => {
        column_mapping  => [
        'id'       => { type => 'decimal', id => 1 },
        'event_id'      => { type => 'decimal' },
        'title_id'      => { type => 'decimal' },
        'rank'      => { type => 'decimal' },
        'gift_id' => { type => 'decimal' },
        ]
    },
	'growl' => {
		column_mapping => [
			'id'            => { type => 'decimal', id => 1 },
			'type'          => { type => 'decimal_not_null' },
			'target_device' => { type => 'device' },
			'display_order' => { type => 'decimal_not_null' },
			'title'         => { type => 'string' },
			'description'   => { type => 'string'},
			'icon_path'     => { type => 'string'},
			'display_time'  => { type => 'decimal_not_null' },
			'display_delay' => { type => 'decimal_not_null' },
			'started_at'    => { type => 'date' },
			'ended_at'      => { type => 'date' },
			'elapsed_days_started_at'    => { type => 'date' },
			'elapsed_days_ended_at'      => { type => 'date' },
		],
	},
    'banner_info' => {
        column_mapping => [
        'id'        => { type => 'decimal', id => 1 },
        'ignore_newuser' => { type => 'decimal' },
        'target_device' => { type => 'decimal' },
        'link_type' => { type => 'decimal' },
        'link_body' => { type => 'string' },
        'banner_id' => { type => 'decimal_not_null' },
        'banner_order' => { type => 'decimal_not_null' },
        'start_at' => { type => 'date' },
        'end_at' => { type => 'date' },
        'created_at' => { type => 'date' },
        ],
    },
    'gacha_extra' => {
        column_mapping => [
        'gacha_id' => { type => 'decimal'},
        'gift_id'  => { type => 'decimal' },
        'num'      => { type => 'decimal' },
        'title'    => { type => 'string' },
        ],
    },

    'event_war_term' => {
        column_mapping   => [
        'id'              => { type => 'decimal', id => 1 },
        'event_id'        => { type => 'decimal' },
        'clan_num'        => { type => 'decimal' },
        'max_fever_gauge' => { type => 'decimal' },
        'started_at'      => { type => 'date' },
        'ended_at'        => { type => 'date' },
        'finished_at'     => { type => 'date' },
        ]
    },

    'event_war_stage' => {
        column_mapping => [
        'id'          => { type => 'decimal', id => 1 },
        'event_id'    => { type => 'decimal' },
        'area_id'     => { type => 'decimal' },
        'term_id'     => { type => 'decimal' },
        'name'        => { type => 'string' },
        'hp'          => { type => 'decimal' },
        'expire_time' => { type => 'decimal_not_null' },
        'point'       => { type => 'decimal' },
        'mvp_point_factor'  => { type => 'float' },
        'mvp_gift_id' => { type => 'decimal' },
        ]
    },

    'event_war_clan_rank_incentive' => {
        column_mapping => [
        'id'                      => { type => 'decimal', id => 1 },
        'event_id'                => { type => 'decimal' },
        'term_id'                 => { type => 'decimal' },
        'rank'                    => { type => 'decimal' },
        'necessary_internal_rank' => { type => 'decimal_not_null' },
        'gift_id'                 => { type => 'decimal' },
        ]
    },

    'event_war_defence_bonus' => {
        column_mapping => [
        'id'       => { type => 'decimal', id => 1 },
        'event_id' => { type => 'decimal' },
        'stage_id' => { type => 'decimal' },
        'time'     => { type => 'decimal' },
        'bonus'    => { type => 'float' },
        ]
    },

    'event_war_clan_damage_factor' => {
        column_mapping => [
        'id'            => { type => 'decimal', id => 1 },
        'event_id'      => { type => 'decimal' },
        'user_num'      => { type => 'decimal' },
        'damage_factor' => { type => 'float' },
        ]
    },

    'event_war_stage_factor' => {
        column_mapping => [
        'id'             => { type => 'decimal', id => 1 },
        'event_id'       => { type => 'decimal' },
        'level'          => { type => 'decimal' },
        'defeat_num'     => { type => 'decimal' },
        'hp_factor'      => { type => 'float' },
        'point_factor'   => { type => 'float' },
        ]
    },

    'event_war_clan_card' => {
        column_mapping => [
        'event_id' => { type => 'decimal' },
        'card_id'  => { type => 'decimal' },
        'name'     => { type => 'string' },
        ]
    },

# TODO: Should enable this
#    'event_war_point_bonus_factor' => {
#        column_mapping => [
#        'id' => { type => 'decimal', id => 1},
#        'event_id' => { type => 'decimal' },
#        'damage'  => { type => 'decimal' },
#        'bonus_factor'   => { type => 'float' },
#        ]
#    },

    ## For Analyze
    'analyze_gacha' => {
        column_mapping => [
        'id'     => { type => 'decimal' },
        'label'  => { type => 'string' },
        ]
    },
    'analyze_shop' => {
        column_mapping => [
        'id'     => { type => 'decimal' },
        'label'  => { type => 'string' },
        ]
    },

    'boost_campaign' => {
        column_mapping => [
        'id'            => { type => 'decimal', id => 1},
        'campaign_type' => { type => 'decimal' },
        'boost_type'    => { type => 'decimal' },
        'factor'        => { type => 'float'   },
        'opened_at'     => { type => 'date' },
        'closed_at'     => { type => 'date' },
        ]
    },
    'campaign_login_bonus' => {
        column_mapping => [
        'id'        => { type => 'decimal', id => 1 },
        'name'      => { type => 'string' },
        'comment'   => { type => 'string' },
        'opened_at' => { type => 'date' },
        'closed_at' => { type => 'date' },
        ],
    },
    'campaign_login_bonus_reward' => {
        column_mapping => [
        'id'             => { type => 'decimal', id => 1 },
        'day'            => { type => 'decimal' },
        'login_bonus_id' => { type => 'decimal' },
        'object_type'    => { type => 'decimal' },
        'object_id'      => { type => 'decimal' },
        'value'          => { type => 'decimal' },
        ],
    },

    'restricted_card' => {
        column_mapping => [
        'id'       => { type => 'decimal', id => 1},
        'max_num'  => { type => 'decimal' },
        'event_id' => { type => 'decimal' },
        'card_id1' => { type => 'decimal' },
        'card_id2' => { type => 'decimal' },
        'card_id3' => { type => 'decimal' },
        'card_id4' => { type => 'decimal' },
        'card_id5' => { type => 'decimal' },
        'card_id6' => { type => 'decimal' },
        'card_id7' => { type => 'decimal' },
        'card_id8' => { type => 'decimal' },
        'card_id9' => { type => 'decimal' },
        'card_id10' => { type => 'decimal' },
        'card_id11' => { type => 'decimal' },
        'card_id12' => { type => 'decimal' },
        ]
    },

];

1;
