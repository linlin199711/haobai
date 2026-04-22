import "./styles.css";

const VALID_ACCOUNT = "18900000000";
const VALID_PASSWORD = "123456";
const STORAGE_KEY = "hxhjb-auth";

const asset = (file) => new URL(`../images/工作区/${file}`, import.meta.url).href;

const telephonyAssets = {
  outbound: asset("形状_8_u1135.svg"),
  mute: asset("形状_u1131.svg"),
  signout: asset("u1140.svg"),
  showIdle: new URL("../assets/show-idle-service.svg", import.meta.url).href,
  busyBase: asset("形状_u1276.svg"),
  busyOverlay: asset("路径_u1277.svg"),
  talkingMute: asset("形状_9_u1149.svg"),
  talkingHold: asset("形状_8_3_u1151.svg"),
  talkingMonitor: asset("u1182.svg"),
  talkingTransferBase: asset("形状_8_拷贝_u1126.svg"),
  talkingTransferOverlay: asset("形状_11_u1127.svg"),
  talkingAssist: asset("形状_8_2_u1188.svg"),
  talkingHangup: asset("u1177.svg"),
  talkingRedBase: asset("形状_u1186.svg"),
  talkingRedOverlay: asset("形状_8_2_u1188.svg"),
};

const metricCards = [
  { label: "签入时长（分）", value: "109", icon: "headset" },
  { label: "有效呼入成功数", value: "109", icon: "phone-in" },
  { label: "呼出数（次）", value: "109", icon: "phone-out" },
  { label: "示忙次数（次）", value: "109", icon: "pause" },
  { label: "示忙时长（分钟）", value: "109", icon: "clock" },
  { label: "通时率（%）", value: "109", icon: "trend" },
  { label: "满意个数", value: "109", icon: "smile" },
  { label: "24小时一次性（%）", value: "109", icon: "badge" },
];

const qualityHeaders = ["主叫号码", "被叫号码", "录音录像文本流水号", "质检员", "得分", "问题描述", "正确答案", "创建时间"];
const qualityRows = [
  ["13386935672", "059110000", "0591100001111", "王镜宇", "10.00", "这是描述这是描述这是描述...", "这是答案这是答案...", "2021/09/21 08:50:08"],
  ["13386935672", "059110000", "0591100001111", "王镜宇", "10.00", "这是描述这是描述这是描述...", "这是答案这是答案...", "2021/09/21 08:50:08"],
  ["13386935672", "059110000", "0591100001111", "王镜宇", "10.00", "这是描述这是描述这是描述...", "这是答案这是答案...", "2021/09/21 08:50:08"],
  ["13386935672", "059110000", "0591100001111", "王镜宇", "10.00", "这是描述这是描述这是描述...", "这是答案这是答案...", "2021/09/21 08:50:08"],
  ["13300999989", "059110000", "0591100002222", "刘一鸣", "9.50", "服务用语不够完整...", "补充标准问候语...", "2021/09/21 09:12:12"],
];

const skillGroups = [
  {
    key: "voice-services",
    title: "语音通话",
    items: [
      "政务12345热线总队列",
      "政策法规咨询队列",
      "社保医保咨询队列",
      "公积金业务咨询队列",
      "户籍公安业务咨询队列",
      "不动产登记咨询队列",
      "城市管理诉求受理队列",
      "生态环境投诉受理队列",
      "教育入学咨询队列",
      "劳动维权服务队列",
      "企业服务专席队列",
      "应急联动支撑队列",
    ],
  },
  {
    key: "online-services",
    title: "在线服务",
    items: [
      "在线诉求受理队列",
      "工单办理进度查询队列",
      "政企服务咨询队列",
      "住房保障咨询队列",
      "交通出行咨询队列",
      "医疗卫生服务队列",
      "民生服务受理队列",
      "物业管理投诉队列",
      "满意度评价回访队列",
      "知识库图文支撑队列",
      "营商环境在线服务队列",
      "便民服务掌上办理队列",
    ],
  },
];

const skillSummaryExpandedDefaultState = skillGroups.map((group) => group.key);

const skillEditorColumns = [
  {
    key: "voice",
    title: "语音技能队列",
    icon: "mic",
    fixedItems: ["政务热线总队列", "民生诉求处理队列", "应急联动服务队列"],
    tree: [
      {
        key: "voice-group-1",
        label: "政务热线接听技能组",
        children: [
          { key: "voice-group-1-1", label: "政务热线接听队列1.1" },
          { key: "voice-group-1-2", label: "政务热线接听队列1.2" },
        ],
      },
      {
        key: "voice-group-2",
        label: "民生诉求处理技能组",
        children: [
          { key: "voice-group-2-1", label: "民生诉求处理队列2.1" },
          { key: "voice-group-2-2", label: "民生诉求处理队列2.2" },
          { key: "voice-group-2-3", label: "民生诉求处理队列2.3" },
        ],
      },
    ],
    defaultSelected: ["voice-group-1-1", "voice-group-1-2", "voice-group-2-1"],
  },
  {
    key: "text",
    title: "文字技能队列",
    icon: "text",
    fixedItems: ["在线文字总队列", "政策咨询文字队列", "图文受理支撑队列"],
    tree: [
      {
        key: "text-group-1",
        label: "在线文字咨询技能组",
        children: [
          { key: "text-group-1-1", label: "在线文字咨询队列1.1" },
          { key: "text-group-1-2", label: "在线文字咨询队列1.2" },
        ],
      },
      {
        key: "text-group-2",
        label: "图文受理技能组",
        children: [
          { key: "text-group-2-1", label: "图文受理技能队列2.1" },
          { key: "text-group-2-2", label: "图文受理技能队列2.2" },
          { key: "text-group-2-3", label: "图文受理技能队列2.3" },
        ],
      },
    ],
    defaultSelected: ["text-group-1-1", "text-group-1-2", "text-group-2-1"],
  },
  {
    key: "video",
    title: "视频技能队列",
    icon: "video",
    fixedItems: ["视频客服总队列", "远程帮办服务队列", "视频回访支撑队列"],
    tree: [
      {
        key: "video-group-1",
        label: "视频客服技能组",
        children: [
          { key: "video-group-1-1", label: "视频客服技能队列1.1" },
          { key: "video-group-1-2", label: "视频客服技能队列1.2" },
        ],
      },
      {
        key: "video-group-2",
        label: "远程帮办技能组",
        children: [
          { key: "video-group-2-1", label: "远程帮办技能队列2.1" },
          { key: "video-group-2-2", label: "远程帮办技能队列2.2" },
          { key: "video-group-2-3", label: "远程帮办技能队列2.3" },
        ],
      },
    ],
    defaultSelected: ["video-group-1-1", "video-group-1-2", "video-group-2-1"],
  },
];

const skillEditorExpandedDefaultState = Object.fromEntries(
  skillEditorColumns.map((column) => [
    column.key,
    column.tree.filter((node) => node.children?.length).map((node) => node.key),
  ]),
);

const skillEditorSelectedDefaultState = Object.fromEntries(
  skillEditorColumns.map((column) => [column.key, [...column.defaultSelected]]),
);

const workSigninRows = [
  { label: "签入次数", value: "999", unit: "次" },
  { label: "签出次数", value: "999", unit: "次" },
  { label: "签入时长", value: "999", unit: "分钟" },
  { label: "小休时长", value: "999", unit: "分钟" },
  { label: "整理时长", value: "999", unit: "分钟" },
  { label: "静音时长", value: "30", unit: "分钟" },
];

const timeDistributionRows = [
  { label: "空闲时长", value: "999", unit: "分钟" },
  { label: "示忙时长", value: "999", unit: "分钟" },
  { label: "保持时长", value: "12", unit: "分钟" },
  { label: "通话时长", value: "126", unit: "分钟" },
  { label: "离开时长", value: "0", unit: "分钟" },
  { label: "后处理时长", value: "16", unit: "分钟" },
];

const efficiencySigninRows = [
  { label: "签入次数", value: "999", unit: "次" },
  { label: "签入时长", value: "00:00:00", unit: "" },
];

const efficiencyCallRows = [
  { label: "呼入成功次数", value: "999", unit: "次" },
  { label: "呼入平均通话时长", value: "999", unit: "秒" },
  { label: "呼入平均处理时长", value: "999", unit: "秒" },
  { label: "呼入在线利用率", value: "999", unit: "%" },
  { label: "呼出成功次数", value: "999", unit: "次" },
  { label: "呼出总时长", value: "999", unit: "秒" },
  { label: "解决率", value: "999", unit: "%" },
  { label: "未解决数", value: "999", unit: "通" },
  { label: "满意率", value: "999", unit: "%" },
  { label: "不满意数", value: "999", unit: "通" },
  { label: "主要呼入量", value: "999", unit: "通" },
  { label: "一次性解决率", value: "999", unit: "%" },
];

const efficiencyStatusRows = [
  { label: "静音时长", value: "00:00:00", unit: "" },
  { label: "保持时长", value: "00:00:00", unit: "" },
  { label: "示忙次数", value: "999", unit: "次" },
  { label: "示忙时长", value: "00:00:00", unit: "" },
  { label: "小休次数", value: "999", unit: "次" },
  { label: "小休时长", value: "00:00:00", unit: "" },
  { label: "整理时长", value: "00:00:00", unit: "" },
  { label: "转接次数", value: "999", unit: "次" },
  { label: "通话时长", value: "00:00:00", unit: "" },
  { label: "空闲时长", value: "00:00:00", unit: "" },
  { label: "有效工作时长", value: "00:00:00", unit: "" },
  { label: "转出次数", value: "999", unit: "次" },
];

const efficiencyDistributionRows = [
  { label: "呼出总时长", time: "00:00:00", percent: "30%", tone: "is-red" },
  { label: "呼入总时长", time: "00:00:00", percent: "20%", tone: "is-orange" },
  { label: "小休时长", time: "00:00:00", percent: "10%", tone: "is-yellow" },
  { label: "整理时长", time: "00:00:00", percent: "10%", tone: "is-yellow" },
  { label: "空闲时长", time: "00:00:00", percent: "10%", tone: "is-yellow" },
  { label: "静音时长", time: "00:00:00", percent: "10%", tone: "is-yellow" },
  { label: "保持时长", time: "00:00:00", percent: "10%", tone: "is-yellow" },
];

const workTimelineRows = [
  ["08:30", "系统登录", "工作台", "完成当日初始化检查，加载个人配置和语音能力。"],
  ["09:00", "PC签入", "语音通话", "开始接听福建福州 0591 语音通话。"],
  ["09:20", "示忙处理", "质检回看", "处理上一通电话质检备注，暂停新进线。"],
  ["10:10", "恢复空闲", "工作台", "完成备注录入，恢复正常接线状态。"],
];

const workRecordHeaders = ["方向", "类型", "业务分类", "开始时间", "客户姓名", "主叫号码", "被叫号码", "时长", "结果", "受理情况", "备注", "业务路径"];
const workRecordRows = [
  ["呼入", "人工", "宽带咨询", "2022-10-01 17:31:00", "张先生", "18900000000", "059110000", "98", "满意", "已完成", "正常接听", "查询 > 咨询查询 > 宽带端口资源查询 > 光纤宽带"],
  ["呼入", "人工", "套餐咨询", "2022-10-01 17:12:00", "李女士", "1386935672", "059110000", "126", "处理中", "已受理", "待回访", "查询 > 咨询查询 > 套餐资费 > 家庭融合"],
  ["呼出", "外呼", "满意度回访", "2022-10-01 16:58:00", "陈先生", "13300999989", "059110000", "215", "满意", "已完成", "已记录", "回访 > 满意度回访 > 月度抽样"],
  ["呼入", "人工", "故障报修", "2022-10-01 16:32:00", "周女士", "18888888888", "059110000", "63", "受理中", "已派单", "等待工程回单", "报障 > 宽带报障 > 家庭宽带"],
];

const workRecordTableRows = [
  {
    id: "record-1",
    direction: "呼入",
    collected: "否",
    crossProvince: "是",
    callType: "政策咨询",
    callTime: "2023-02-05 09:31:00",
    city: "福州",
    province: "福建",
    caller: "15600023331",
    callee: "095210000",
    duration: 30,
    satisfactionType: "非常满意",
    hangupReason: "用户挂机",
    result: "已办结",
    track: "社保政策咨询 > 养老保险 > 参保查询",
  },
  {
    id: "record-2",
    direction: "呼入",
    collected: "否",
    crossProvince: "是",
    callType: "民生诉求",
    callTime: "2023-02-05 09:30:00",
    city: "福州",
    province: "福建",
    caller: "15600023331",
    callee: "095210000",
    duration: 30,
    satisfactionType: "满意",
    hangupReason: "坐席挂机",
    result: "待补采",
    track: "民生诉求 > 垃圾清运 > 清运投诉",
  },
  {
    id: "record-3",
    direction: "呼入",
    collected: "是",
    crossProvince: "是",
    callType: "投诉举报",
    callTime: "2023-02-05 09:20:00",
    city: "厦门",
    province: "福建",
    caller: "15600023331",
    callee: "095210000",
    duration: 45,
    satisfactionType: "未评价",
    hangupReason: "系统释放",
    result: "处理中",
    track: "投诉举报 > 市容环境 > 噪声扰民",
  },
  {
    id: "record-4",
    direction: "呼出",
    collected: "否",
    crossProvince: "否",
    callType: "满意度回访",
    callTime: "2023-02-05 09:10:00",
    city: "福州",
    province: "福建",
    caller: "059110000",
    callee: "13800138000",
    duration: 62,
    satisfactionType: "满意",
    hangupReason: "用户挂机",
    result: "已回访",
    track: "回访 > 满意度回访 > 月度回访",
  },
  {
    id: "record-5",
    direction: "呼出",
    collected: "是",
    crossProvince: "否",
    callType: "主动外呼",
    callTime: "2023-02-05 08:52:00",
    city: "泉州",
    province: "福建",
    caller: "059110000",
    callee: "13900008888",
    duration: 90,
    satisfactionType: "非常满意",
    hangupReason: "正常挂机",
    result: "已完成",
    track: "主动外呼 > 事项通知 > 办件提醒",
  },
  {
    id: "record-6",
    direction: "呼入",
    collected: "否",
    crossProvince: "否",
    callType: "信息查询",
    callTime: "2023-02-05 08:30:00",
    city: "福州",
    province: "福建",
    caller: "13788886666",
    callee: "095210000",
    duration: 21,
    satisfactionType: "未评价",
    hangupReason: "用户挂机",
    result: "已办结",
    track: "信息查询 > 公积金查询 > 缴存明细",
  },
];

const workRecordSatisfactionOptions = ["非常满意", "满意", "未评价"];
const workRecordCallTypeOptions = ["政策咨询", "民生诉求", "投诉举报", "满意度回访", "主动外呼", "信息查询"];
const workRecordHangupReasonOptions = ["用户挂机", "坐席挂机", "系统释放", "正常挂机"];
const workRecordCityOptions = ["福州", "厦门", "泉州"];
const workRecordCollectedOptions = ["是", "否"];
const workRecordCrossProvinceOptions = ["是", "否"];
const workRecordProvinceOptions = ["福建"];

const transferSeatHeaders = ["工号", "姓名", "技能组", "班组", "操作"];
const transferSeatRows = [
  ["059110000", "王镜宇", "语音通话", "某某班组", "转接"],
  ["059110001", "刘一鸣", "语音通话", "某某班组", "转接"],
  ["059110002", "赵晓静", "在线服务", "某某班组", "转接"],
  ["059110003", "陈晓晓", "在线服务", "某某班组", "转接"],
];

const transferSkillHeaders = ["技能组名称", "技能组描述", "空闲数", "签入数", "操作"];
const transferSkillRows = [
  ["云南-三星技能", "福建福州 0591", "32", "12", "转接"],
  ["云南-七星技能", "福建福州 0591", "18", "7", "转接"],
  ["政企查询技能", "政企查询业务", "09", "3", "转接"],
];

const transferExternalHeaders = ["外线号码", "归属地", "适用范围", "路径", "备注", "操作"];
const transferExternalRows = [
  ["123456", "福建福州", "语音通话", "查询 > 咨询查询 > 宽带端口资源查询 > 光纤宽带", "按场景选择外线号码", "转接"],
  ["123457", "福建福州", "语音通话", "查询 > 咨询查询 > 套餐资费", "家庭融合资费转接", "转接"],
  ["123458", "厦门", "政企查询", "政企 > 专线业务", "政企客服专线", "转接"],
];

const collectHeaders = ["主叫号码", "被叫号码", "分类", "标签", "状态", "知识项", "技能组", "时间"];
const collectCurrentRows = [
  ["18900000000", "059110000", "来话采集", "政企查询", "已选", "宽带端口资源查询", "语音通话", "2022/10/03 13:00:26"],
  ["18900000000", "059110000", "来话采集", "信息查询", "已选", "套餐资费查询", "语音通话", "2022/10/03 12:36:02"],
];

const collectHistoryRows = [
  ["1386935672", "059110000", "历史未采集", "查询业务", "待处理", "宽带端口资源查询", "福建福州 0591", "2022/10/02 15:20:18"],
  ["13300999989", "059110000", "历史未采集", "受理业务", "待处理", "业务办理记录查询", "福建福州 0591", "2022/10/01 09:12:12"],
];

const collectCategories = ["我的收藏", "咨询业务", "优惠促销", "增值业务", "号码百事通", "天翼移动业务", "政企查询", "信息查询", "查询业务", "受理业务", "分流业务"];

const transferSeatPageRows = [
  { id: "seat-1", code: "123456", name: "赵某某", status: "空闲", role: "某某角色、某某角色..", skill: "某某技能、某某技能、某某技能..." },
  { id: "seat-2", code: "123456", name: "赵某某", status: "空闲", role: "某某角色", skill: "某某技能" },
  { id: "seat-3", code: "123456", name: "赵某某", status: "空闲", role: "某某角色", skill: "某某技能" },
  { id: "seat-4", code: "123456", name: "赵某某", status: "空闲", role: "某某角色", skill: "某某技能" },
  { id: "seat-5", code: "123456", name: "赵某某", status: "忙碌", role: "某某角色", skill: "某某技能" },
];

const transferExternalPageRows = [
  { id: "external-1", number: "95533", type: "互助号码", note: "这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明..." },
  { id: "external-2", number: "95533", type: "互助号码", note: "这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明..." },
  { id: "external-3", number: "95533", type: "互助号码", note: "这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明..." },
  { id: "external-4", number: "95533", type: "互助号码", note: "这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明..." },
  { id: "external-5", number: "95533", type: "互助号码", note: "这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明这是号码说明..." },
];

const transferSkillTree = [
  {
    key: "region-center",
    label: "某某区域中心",
    children: [
      { key: "skill-bill", label: "话费查询" },
      { key: "skill-package-a", label: "套餐及流量查询" },
      { key: "skill-package-b", label: "套餐及流量查询" },
      { key: "skill-package-c", label: "套餐及流量查询" },
      { key: "skill-broadband", label: "话费流量及密码服务" },
    ],
  },
];

const transferSkillPageRows = [
  { id: "queue-1", groupKey: "region-center", code: "00023967", name: "某某队列", mutual: "是", signInCount: 11, waitCount: 11, idleCount: 11 },
  { id: "queue-2", groupKey: "skill-bill", code: "00023967", name: "某某队列", mutual: "是", signInCount: 22, waitCount: 22, idleCount: 22 },
  { id: "queue-3", groupKey: "skill-package-a", code: "00023967", name: "某某队列", mutual: "是", signInCount: 33, waitCount: 33, idleCount: 33 },
  { id: "queue-4", groupKey: "skill-package-b", code: "00023967", name: "某某队列", mutual: "是", signInCount: 55, waitCount: 55, idleCount: 55 },
  { id: "queue-5", groupKey: "skill-package-c", code: "00023967", name: "某某队列", mutual: "否", signInCount: 66, waitCount: 66, idleCount: 66 },
  { id: "queue-6", groupKey: "skill-broadband", code: "00023967", name: "某某队列", mutual: "否", signInCount: 66, waitCount: 66, idleCount: 66 },
];

const transferSkillTree12345 = [
  {
    key: "hotline-center",
    label: "政务12345热线中心",
    children: [
      {
        key: "city-management",
        label: "城市管理",
        children: [
          { key: "city-management-street", label: "占道经营" },
          { key: "city-management-noise", label: "噪声扰民" },
          { key: "city-management-garbage", label: "垃圾清运" },
        ],
      },
      {
        key: "public-service",
        label: "公共服务",
        children: [
          { key: "public-service-water", label: "供水保障" },
          { key: "public-service-light", label: "路灯报修" },
          { key: "public-service-parking", label: "停车管理" },
        ],
      },
      {
        key: "livelihood",
        label: "民生诉求",
        children: [
          { key: "livelihood-social", label: "社保咨询" },
          { key: "livelihood-property", label: "物业纠纷" },
          { key: "livelihood-labor", label: "劳动维权" },
        ],
      },
    ],
  },
];

const transferSkillPageRows12345 = [
  { id: "queue-1", groupKey: "hotline-center", code: "00023967", name: "政务12345总队列", mutual: "是", signInCount: 11, waitCount: 11, idleCount: 11 },
  { id: "queue-2", groupKey: "city-management-street", code: "00023968", name: "占道经营处置队列", mutual: "是", signInCount: 22, waitCount: 22, idleCount: 22 },
  { id: "queue-3", groupKey: "city-management-noise", code: "00023969", name: "噪声扰民处置队列", mutual: "是", signInCount: 33, waitCount: 33, idleCount: 33 },
  { id: "queue-4", groupKey: "public-service-water", code: "00023970", name: "供水保障服务队列", mutual: "是", signInCount: 55, waitCount: 55, idleCount: 55 },
  { id: "queue-5", groupKey: "livelihood-social", code: "00023971", name: "社保咨询服务队列", mutual: "否", signInCount: 66, waitCount: 66, idleCount: 66 },
  { id: "queue-6", groupKey: "livelihood-labor", code: "00023972", name: "劳动维权工单队列", mutual: "否", signInCount: 66, waitCount: 66, idleCount: 66 },
];

const transferSkillExpandedDefaultKeys = ["hotline-center", "city-management", "public-service", "livelihood"];
const TRANSFER_SKILL_PAGE_SIZE = 5;

const collectWorkspaceTabs = [
  { key: "current", label: "本通电话", time: "09:30:00" },
  { key: "related", label: "15605910268", time: "09:30:00" },
];
const collectWorkspaceSidebar = [
  { key: "favorites", label: "我的收藏", children: [] },
  { key: "consult", label: "咨询业务", children: ["优惠促销", "增值业务", "号码百事通", "天翼移动业务", "政企查询", "信息查询"] },
  { key: "query", label: "查询业务", children: [] },
  { key: "accept", label: "受理业务", children: [] },
  { key: "dispatch", label: "分流业务", children: [] },
];
const collectWorkspaceItems = Array.from({ length: 9 }, (_, index) => ({
  id: `collect-${index + 1}`,
  name: "查询->咨询查询->宽带端口资源查询->光纤宽带",
}));
const collectWorkspaceSerial = "350666963232223156";
const collectDefaultSelectedIds = collectWorkspaceItems.slice(0, 4).map((item) => item.id);

const collectReasonTree = [
  {
    key: "consult",
    label: "咨询业务",
    children: [
      {
        key: "consult-policy",
        label: "政策咨询",
        children: [
          { key: "consult-policy-social", label: "社保医保政策咨询" },
          { key: "consult-policy-housing", label: "住房公积金政策咨询" },
          { key: "consult-policy-education", label: "义务教育入学政策咨询" },
        ],
      },
      {
        key: "consult-public",
        label: "公共服务咨询",
        children: [
          { key: "consult-public-garbage", label: "垃圾分类咨询" },
          { key: "consult-public-bus", label: "公交线路咨询" },
          { key: "consult-public-hall", label: "便民服务网点咨询" },
        ],
      },
    ],
  },
  {
    key: "query",
    label: "查询业务",
    children: [
      { key: "query-workorder", label: "工单办理进度查询" },
      { key: "query-estate", label: "不动产登记信息查询" },
      { key: "query-social", label: "社保缴费记录查询" },
      { key: "query-company", label: "企业登记信息查询" },
    ],
  },
  {
    key: "accept",
    label: "受理业务",
    children: [
      {
        key: "accept-city",
        label: "城市管理",
        children: [
          { key: "accept-city-occupy", label: "占道经营" },
          { key: "accept-city-noise", label: "施工噪音扰民" },
          { key: "accept-city-garbage", label: "垃圾清运不及时" },
        ],
      },
      {
        key: "accept-traffic",
        label: "交通设施",
        children: [
          { key: "accept-traffic-road", label: "道路破损" },
          { key: "accept-traffic-light", label: "路灯故障" },
          { key: "accept-traffic-signal", label: "交通信号灯故障" },
        ],
      },
      {
        key: "accept-community",
        label: "民生服务",
        children: [
          { key: "accept-community-property", label: "物业管理投诉" },
          { key: "accept-community-water", label: "停水停电报修" },
          { key: "accept-community-labor", label: "拖欠工资投诉" },
        ],
      },
    ],
  },
  {
    key: "dispatch",
    label: "分流业务",
    children: [
      {
        key: "dispatch-emergency",
        label: "应急联动",
        children: [
          { key: "dispatch-emergency-movecar", label: "紧急挪车" },
          { key: "dispatch-emergency-gas", label: "燃气泄漏" },
          { key: "dispatch-emergency-manhole", label: "井盖缺失" },
        ],
      },
      {
        key: "dispatch-department",
        label: "部门转办",
        children: [
          { key: "dispatch-department-market", label: "市场监管转办" },
          { key: "dispatch-department-housing", label: "住建部门转办" },
          { key: "dispatch-department-env", label: "生态环境转办" },
        ],
      },
    ],
  },
];
const collectFavoriteLeafKeys = [
  "accept-community-property",
  "consult-policy-social",
  "query-workorder",
  "dispatch-emergency-movecar",
];
const collectExpandedDefaultKeys = ["consult", "query", "accept", "dispatch"];
const helpPageManuals = [
  { name: "集约门户框架操作手册.pdf", size: "10.5M", action: "下载" },
];
const helpPageBrowsers = [
  { key: "firefox", name: "火狐浏览器", version: "105.0 5 195.102", action: "下载" },
  { key: "chrome", name: "谷歌浏览器", version: "105.0 5 195.102", action: "下载" },
  { key: "edge", name: "IE浏览器", version: "105.0 5 195.102", action: "下载" },
  { key: "360", name: "360浏览器", version: "105.0 5 195.102", action: "下载" },
];

const helpManuals = [
  { name: "集约门户框架操作手册.pdf", desc: "原稿中的操作手册入口", action: "打开" },
  { name: "集约门户框架操作手册.docx", desc: "文档版操作说明", action: "下载" },
];

const helpBrowsers = [
  { name: "Chrome", version: "建议版本 104+", action: "打开浏览器下载页" },
  { name: "Edge", version: "建议版本 104+", action: "打开浏览器下载页" },
  { name: "360 极速浏览器", version: "极速模式", action: "查看兼容说明" },
];

const settingsShortcutRows = [
  { label: "启用静音/取消静音快捷键", value: "F6" },
  { label: "启用示忙/取消示忙快捷键", value: "F7" },
  { label: "启用签出/退出快捷键", value: "F8" },
  { label: "启用采集来话原因（话后采集）快捷键", value: "ALT+C" },
];

const settingsMetricOptions = ["签入时长", "有效呼入成功数", "呼出数", "示忙次数", "示忙时长", "通时率", "满意个数", "24小时一次性"];
const settingsPageShortcuts = [
  { id: "collect-reason", label: "启用采集来话原因（话后采集）快捷键", value: "ALT+C" },
  { id: "window-switch", label: "启用窗口切换快捷键", value: "ALT+M" },
  { id: "signout", label: "启用签出/退出快捷键", value: "F8" },
];
const settingsPageMetricOptions = [
  { id: "sign-duration", label: "签入时长" },
  { id: "show-idle-duration", label: "示忙/强制示忙时长" },
  { id: "arrange-duration", label: "整理时长" },
  { id: "daily-once", label: "24小时一次性" },
  { id: "success-inbound", label: "有效呼入成功数" },
  { id: "avg-talk-duration", label: "平均通话时长" },
  { id: "satisfaction-count", label: "满意个数" },
  { id: "rating-rate", label: "参评率" },
  { id: "outbound-count", label: "呼出数" },
  { id: "break-count", label: "小休/强制小休" },
  { id: "punctuality-rate", label: "遵时率" },
  { id: "very-satisfied-rate", label: "非常满意率" },
  { id: "show-idle-count", label: "示忙/强制示忙次数" },
  { id: "break-duration", label: "小休/强制小休时长" },
  { id: "productivity", label: "生产力" },
];
const settingsPagePasswordRules = [
  "口令长度至少 8 位",
  "口令包括数字、小写字母、大写字母、特殊符号 4 类中至少 3 类",
  "口令不得为连续的数字或字母排列",
  "口令与用户名无相关性，口令中不得包含用户名的完整字符串、大小写变位或形似变换的字符串",
  "口令设置避免键盘排序密码",
  "口令设置避免连续数字和连续字母排序密码",
];
const outboundSourceNumbers = ["059110000", "059110000", "059110000", "059110000", "059110000", "059110000", "059110000"];

const app = document.querySelector("#app");

const state = {
  route: localStorage.getItem(STORAGE_KEY) === "1" ? "workspace" : "login",
  login: {
    account: VALID_ACCOUNT,
    password: "",
    slider: 0,
    verified: false,
    showPassword: false,
    error: "",
  },
  workspace: {
    nav: "dashboard",
    sidePanel: "skills",
    workStatusTab: "efficiency",
    workEfficiencyDateFrom: "2023-02-05 00:00:00",
    workEfficiencyDateTo: "2023-02-05 00:00:00",
    workRecordCaller: "",
    workRecordCallee: "",
    workRecordSatisfactionType: "",
    workRecordCallType: "",
    workRecordHangupReason: "",
    workRecordCity: "",
    workRecordCollected: "",
    workRecordCrossProvince: "",
    workRecordProvince: "",
    workRecordDateFrom: "2023-02-05 00:00:00",
    workRecordDateTo: "2023-02-05 00:00:00",
    workRecordPlayingId: "",
    workRecordPlayerOpen: false,
    workRecordPlayerMinimized: false,
    workRecordPlayerPaused: true,
    workRecordPlayerStatus: "stopped",
    workRecordPlayerRate: 1,
    workRecordPlayerCurrentTime: 0,
    workRecordPlayerDuration: 0,
    workRecordPlayerRowId: "",
    workRecordPlayerLastTick: 0,
    note: "今天重点跟进宽带咨询、政企查询和满意度回访记录。",
    activeModal: "",
    skillSummaryGroups: cloneSkillSummaryGroups(),
    skillSummaryExpandedKeys: [...skillSummaryExpandedDefaultState],
    helpSection: "manual",
    settingsTab: "general",
    transferTab: "seat",
    collectTab: "current",
    transferPageOpen: false,
    settingsPageOpen: false,
    collectPageOpen: false,
    helpPageOpen: false,
    transferSeatOnlyIdle: true,
    transferSeatDirect: false,
    transferSeatSelectedIds: [],
    transferSeatPage: 1,
    transferExternalSelectedIds: ["external-1"],
    transferExternalPage: 1,
    transferSkillSelectedId: "queue-1",
    transferSkillPage: 1,
    transferSkillExpandedKeys: transferSkillExpandedDefaultKeys,
    transferSkillTreeSelection: "hotline-center",
    transferSeatScope: "",
    transferSeatSkillGroup: "",
    transferSeatRole: "",
    transferSeatPermission: "",
    transferSeatTeam: "",
    transferSeatPerson: "",
    transferExternalScope: "",
    transferExternalDescription: "",
    transferExternalNumber: "",
    transferSeatExtraInfo: "",
    incomingDemoNumber: "18900000000",
    incomingDemoActive: false,
    incomingDemoMinimized: false,
    transferDemoMinimized: false,
    transferDemoStage: "idle",
    transferDemoSeatId: "",
    transferDemoSeatName: "",
    transferDemoSeatCode: "",
    transferDemoRemark: "",
    skillEditorSelectedKeys: cloneSkillEditorMap(skillEditorSelectedDefaultState),
    skillEditorDraftSelectedKeys: cloneSkillEditorMap(skillEditorSelectedDefaultState),
    skillEditorExpandedKeys: cloneSkillEditorMap(skillEditorExpandedDefaultState),
    transferSkillName: "",
    transferSkillCode: "",
    transferSkillExtraInfo: "",
    settingsAutoStart: true,
    settingsWindowMode: "windowed",
    settingsShortcutSelection: settingsPageShortcuts.map((item) => item.id),
    settingsMetricSelection: settingsPageMetricOptions.map((item) => item.id),
    settingsLogFolder: "某某文件夹",
    settingsLogCleanup: "6个月后执行",
    settingsOldPassword: "",
    settingsNewPassword: "",
    settingsConfirmPassword: "",
    collectSidebar: "favorites",
    collectTreeSelection: "favorites",
    collectExpandedKeys: collectExpandedDefaultKeys,
    collectKeyword: "",
    collectAcceptedNumber: "",
    collectSelectedIds: collectDefaultSelectedIds,
    collectRemark: "",
    collectKeepRecording: true,
    collectScene: "policy",
    collectCategory: "我的收藏",
    showNetworkCard: false,
    telephony: {
      status: "unsigned",
      source: "",
      outboundSource: "059110000",
      outboundSourceIndex: 0,
      ringMuted: false,
      muted: false,
      hold: false,
      busyAfterHangup: false,
      redMarked: false,
      showDialer: false,
      dialNumber: "18900000000",
      queueNumber: "059110000",
      callNumber: "18900000000",
      incomingStartedAt: 0,
      callStartedAt: 0,
      outboundStartedAt: 0,
      mutedStartedAt: 0,
      holdStartedAt: 0,
      transferStatusText: "",
    },
  },
  now: Date.now(),
  toast: "",
};

const dragState = {
  active: false,
  rect: null,
};

function icon(name) {
  const common = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  switch (name) {
    case "menu":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>`;
    case "help":
      return `<svg viewBox="0 0 24 24" ${common}><circle cx="12" cy="12" r="9"/><path d="M9.6 9.6a2.4 2.4 0 1 1 4.7.8c-.6 1-1.6 1.4-2.3 2.1-.4.4-.6.8-.6 1.5"/><path d="M12 17.4h.01"/></svg>`;
    case "signal":
      return `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="14" width="2.5" height="6" rx="1"/><rect x="9" y="11" width="2.5" height="9" rx="1"/><rect x="14" y="8" width="2.5" height="12" rx="1"/><rect x="19" y="4" width="2.5" height="16" rx="1"/></svg>`;
    case "gear":
      return `<svg viewBox="0 0 24 24" ${common}><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-1.9-3.2-2.4 1a7.3 7.3 0 0 0-1.9-1.1l-.4-2.6H10l-.4 2.6a7.3 7.3 0 0 0-1.9 1.1l-2.4-1-1.9 3.2 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.1l-2 1.5 1.9 3.2 2.4-1c.6.5 1.2.8 1.9 1.1l.4 2.6h3.8l.4-2.6c.7-.3 1.3-.6 1.9-1.1l2.4 1 1.9-3.2-2-1.5c.1-.3.1-.7.1-1.1Z"/></svg>`;
    case "database":
      return `<svg viewBox="0 0 24 24" ${common}><ellipse cx="12" cy="6.5" rx="6.5" ry="2.8"/><path d="M5.5 6.5v5c0 1.6 2.9 2.8 6.5 2.8s6.5-1.2 6.5-2.8v-5"/><path d="M5.5 11.5v5c0 1.6 2.9 2.8 6.5 2.8s6.5-1.2 6.5-2.8v-5"/></svg>`;
    case "fullscreen":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M8 4H4v4"/><path d="M16 4h4v4"/><path d="M4 16v4h4"/><path d="M20 16v4h-4"/></svg>`;
    case "dashboard":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>`;
    case "chart":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/></svg>`;
    case "headset":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M4 12a8 8 0 0 1 16 0"/><rect x="4" y="11" width="4" height="7" rx="2"/><rect x="16" y="11" width="4" height="7" rx="2"/><path d="M20 18a3 3 0 0 1-3 3h-2"/></svg>`;
    case "computer":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M9 19h6"/><path d="M12 16v3"/></svg>`;
    case "mobile-device":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="7" y="3.5" width="10" height="17" rx="2.2"/><path d="M11 6.5h2"/><path d="M11.7 17.2h.6"/></svg>`;
    case "phone":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M7 5h3l2 5-2 1.5a13 13 0 0 0 4.5 4.5L16 14l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3h2Z"/></svg>`;
    case "phone-in":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M19 12v7a2 2 0 0 1-2.2 2A17 17 0 0 1 3 7.2 2 2 0 0 1 5 5h3l2 5-2 1.5a13 13 0 0 0 4.5 4.5L14 14l5 2"/><path d="m18 3 3 3-3 3"/><path d="M21 6h-8"/></svg>`;
    case "phone-out":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M7 5h3l2 5-2 1.5a13 13 0 0 0 4.5 4.5L16 14l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3h2Z"/><path d="m14 9 3-3 3 3"/><path d="M17 6v8"/></svg>`;
    case "mic":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0"/><path d="M12 17v3"/><path d="M8.5 20h7"/></svg>`;
    case "text":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M6 5h12"/><path d="M12 5v14"/><path d="M8 19h8"/></svg>`;
    case "video":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="4" y="7" width="11" height="10" rx="2"/><path d="m15 10 5-3v10l-5-3z"/></svg>`;
    case "cup":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M5 9h11v5.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5Z"/><path d="M16 10h1.3A2.7 2.7 0 0 1 20 12.7v0a2.3 2.3 0 0 1-2.3 2.3H16"/><path d="M8 5.2c0 1-1 1.4-1 2.6"/><path d="M12 5.2c0 1-1 1.4-1 2.6"/></svg>`;
    case "pause":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="7" y="5" width="3" height="14" rx="1"/><rect x="14" y="5" width="3" height="14" rx="1"/></svg>`;
    case "clock":
      return `<svg viewBox="0 0 24 24" ${common}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 2"/></svg>`;
    case "trend":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M5 16 10 11l3 3 6-7"/><path d="M15 7h4v4"/></svg>`;
    case "smile":
      return `<svg viewBox="0 0 24 24" ${common}><circle cx="12" cy="12" r="8.5"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M8.5 14a5 5 0 0 0 7 0"/></svg>`;
    case "badge":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M9 16h6"/><path d="M9 8h6"/><path d="M12 12v0"/></svg>`;
    case "edit":
      return `<svg viewBox="0 0 24 24" ${common}><path d="m4 20 4.2-1 9.5-9.5a2.2 2.2 0 0 0-3.2-3.2L5 15.8 4 20Z"/><path d="m13.5 7.5 3 3"/></svg>`;
    case "search":
      return `<svg viewBox="0 0 24 24" ${common}><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>`;
    case "calendar":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 4v4"/><path d="M16 4v4"/><path d="M4 10h16"/></svg>`;
    case "close":
      return `<svg viewBox="0 0 24 24" ${common}><path d="m6 6 12 12"/><path d="M18 6 6 18"/></svg>`;
    case "play":
      return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 6.5v11l9-5.5z"/></svg>`;
    case "stop":
      return `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="6.5" width="11" height="11" rx="2"/></svg>`;
    case "forward":
      return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.5 6.5v11l7-5.5z"/><path d="M12 6.5v11l7-5.5z"/></svg>`;
    case "check":
      return `<svg viewBox="0 0 24 24" ${common}><path d="m5 12.5 4.2 4.2L19 7.5"/></svg>`;
    case "star-filled":
      return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.84 5.76 6.36.92-4.6 4.48 1.08 6.33L12 17.35 6.32 20.3l1.08-6.33L2.8 9.48l6.36-.92L12 2.8Z"/></svg>`;
    case "chevron-down":
      return `<svg viewBox="0 0 24 24" ${common}><path d="m6 9 6 6 6-6"/></svg>`;
    case "doc":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M8 3h6l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5"/></svg>`;
    case "download":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M12 4v10"/><path d="m8 10 4 4 4-4"/><path d="M4 20h16"/></svg>`;
    case "lock":
      return `<svg viewBox="0 0 24 24" ${common}><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/></svg>`;
    case "eye":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>`;
    case "eye-off":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M3 3 21 21"/><path d="M10.6 6.2A10.9 10.9 0 0 1 12 6c6 0 9.5 6 9.5 6a16.5 16.5 0 0 1-4 4.3"/><path d="M6.6 8.1A15.7 15.7 0 0 0 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.5-.7"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>`;
    case "key":
      return `<svg viewBox="0 0 24 24" ${common}><circle cx="8" cy="14" r="3"/><path d="M10.5 12 20 3"/><path d="M16 3h4v4"/></svg>`;
    case "save":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M5 4h12l2 2v14H5z"/><path d="M8 4v5h8V4"/><path d="M9 18h6"/></svg>`;
    case "logout":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M14 8l4 4-4 4"/><path d="M9 12h9"/></svg>`;
    case "dialpad":
      return `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="7" r="1.5"/><circle cx="12" cy="7" r="1.5"/><circle cx="17" cy="7" r="1.5"/><circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/><circle cx="7" cy="17" r="1.5"/><circle cx="12" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg>`;
    case "undo":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M9 7H5v4"/><path d="M5 11c1.8-3 5-5 8.8-4.6 3.8.4 6.9 3.1 7.7 6.9.8 3.8-1 7.8-4.5 9.6"/></svg>`;
    case "back":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M9 7 5 11l4 4"/><path d="M6 11h8a5 5 0 0 1 0 10h-1"/></svg>`;
    case "folder":
      return `<svg viewBox="0 0 24 24" ${common}><path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h3l2 2h7a2.5 2.5 0 0 1 2.5 2.5V17A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17Z"/></svg>`;
    default:
      return icon("headset");
  }
}

function metricIcon(iconName) {
  return `<span class="metric-card__icon">${icon(iconName)}</span>`;
}

function toolAsset(src, extra = "") {
  return `<img class="telephony-tool__asset ${extra}" src="${src}" alt="" />`;
}

function stackedTool(base, overlay, overlayClass = "") {
  return `
    <span class="telephony-tool__stack">
      ${toolAsset(base)}
      ${toolAsset(overlay, `telephony-tool__asset--overlay ${overlayClass}`.trim())}
    </span>
  `;
}

function toolIcon(type) {
  switch (type) {
    case "busy":
      return `<span>${icon("cup")}</span>`;
    case "show-idle":
      return `<span>${toolAsset(telephonyAssets.showIdle, "telephony-tool__asset--medium")}</span>`;
    case "outbound":
      return `<span>${toolAsset(telephonyAssets.outbound, "telephony-tool__asset--medium")}</span>`;
    case "ring":
      return `<span>${toolAsset(telephonyAssets.mute, "telephony-tool__asset--medium")}</span>`;
    case "signout":
      return `<span>${toolAsset(telephonyAssets.signout, "telephony-tool__asset--medium")}</span>`;
    case "mute":
      return `<span>${toolAsset(telephonyAssets.talkingMute, "telephony-tool__asset--medium")}</span>`;
    case "hold":
      return `<span>${icon("pause")}</span>`;
    case "record":
      return `<span>${toolAsset(telephonyAssets.talkingMonitor, "telephony-tool__asset--medium")}</span>`;
    case "monitor":
      return `<span>${toolAsset(telephonyAssets.talkingMonitor, "telephony-tool__asset--medium")}</span>`;
    case "transfer":
      return stackedTool(telephonyAssets.talkingTransferBase, telephonyAssets.talkingTransferOverlay, "telephony-tool__asset--overlay-wide");
    case "assist":
      return `<span>${toolAsset(telephonyAssets.talkingAssist, "telephony-tool__asset--medium")}</span>`;
    case "hangup":
      return `<span>${toolAsset(telephonyAssets.outbound, "telephony-tool__asset--medium telephony-tool__asset--hangup")}</span>`;
    case "red":
      return stackedTool(telephonyAssets.talkingRedBase, telephonyAssets.talkingRedOverlay);
    case "rate-hangup":
      return `<span>${icon("star-filled")}</span>`;
    default:
      return `<span>${icon("phone")}</span>`;
  }
}

function statusMeta(status) {
  if (status === "idle") return { label: "空闲", chipClass: "is-active", barClass: "telephony-bar--idle" };
  if (status === "busy") return { label: "示忙中", chipClass: "is-warning", barClass: "telephony-bar--busy" };
  if (status === "incoming") return { label: "呼入中", chipClass: "is-danger", barClass: "telephony-bar--talking" };
  if (status === "outbound") return { label: "外呼中", chipClass: "is-danger", barClass: "telephony-bar--talking" };
  if (status === "talking") return { label: "通话中", chipClass: "is-danger", barClass: "telephony-bar--talking" };
  return { label: "未签入", chipClass: "", barClass: "telephony-bar--unsigned" };
}

function clockText(timestamp) {
  return new Date(timestamp).toLocaleTimeString("zh-CN", { hour12: false });
}

function callDuration() {
  const telephony = state.workspace.telephony;
  const startedAt = telephony.status === "outbound"
    ? telephony.outboundStartedAt
    : telephony.status === "incoming"
      ? telephony.incomingStartedAt
      : telephony.callStartedAt;
  if (!startedAt) return "00:00:00";
  const seconds = Math.max(0, Math.floor((state.now - startedAt) / 1000));
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function renderTelephonyTransferStatus() {
  const text = state.workspace.telephony.transferStatusText;
  if (!text) return "";
  return `<em class="telephony-call__transfer-status">${text}</em>`;
}

function runtimeDuration(startedAt) {
  if (!startedAt) return "00:00:00";
  const seconds = Math.max(0, Math.floor((state.now - startedAt) / 1000));
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function topbarStatusMeta() {
  const status = state.workspace.telephony.status;
  if (status === "idle") return { label: "空闲", chipClass: "is-active" };
  if (status === "busy") return { label: "示忙中", chipClass: "is-warning" };
  if (status === "wrapup") return { label: "整理中", chipClass: "is-warning" };
  if (status === "incoming") return { label: "呼入中", chipClass: "is-danger" };
  if (status === "outbound") return { label: "外呼中", chipClass: "is-danger" };
  if (status === "talking") return { label: "通话中", chipClass: "is-danger" };
  return { label: "未签入", chipClass: "" };
}

function renderTopbarCallFlags() {
  const telephony = state.workspace.telephony;
  if (telephony.status !== "talking" && telephony.status !== "outbound") return "";
  const flags = [];
  if (telephony.muted && telephony.mutedStartedAt) {
    flags.push(`
      <span class="topbar__call-flag is-warning">
        <strong>静音中</strong>
        <em data-mute-duration>${runtimeDuration(telephony.mutedStartedAt)}</em>
      </span>
    `);
  }
  if (telephony.hold && telephony.holdStartedAt) {
    flags.push(`
      <span class="topbar__call-flag is-warning">
        <strong>保持中</strong>
        <em data-hold-duration>${runtimeDuration(telephony.holdStartedAt)}</em>
      </span>
    `);
  }
  return flags.join("");
}

function resetCallInteractionState(options = {}) {
  const { preserveRingMuted = true } = options;
  const telephony = state.workspace.telephony;
  telephony.muted = false;
  telephony.hold = false;
  telephony.busyAfterHangup = false;
  telephony.redMarked = false;
  telephony.showDialer = false;
  telephony.mutedStartedAt = 0;
  telephony.holdStartedAt = 0;
  if (!preserveRingMuted) telephony.ringMuted = false;
}

function clearWrapupTimer() {
  clearTimeout(hangupCall.wrapupTimer);
}

function clearIncomingDemoState() {
  state.workspace.incomingDemoActive = false;
  state.workspace.telephony.incomingStartedAt = 0;
}

function openCallRecordPage() {
  state.workspace.transferPageOpen = false;
  state.workspace.settingsPageOpen = false;
  state.workspace.collectPageOpen = false;
  state.workspace.helpPageOpen = false;
  state.workspace.nav = "status";
  state.workspace.workStatusTab = "records";
}

function signedIn() {
  return state.workspace.telephony.status !== "unsigned";
}

function setToast(message) {
  state.toast = message;
  render();
  clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2200);
}

function saveRoute() {
  localStorage.setItem(STORAGE_KEY, state.route === "workspace" ? "1" : "0");
}

function signIn(source) {
  Object.assign(state.workspace.telephony, {
    status: "idle",
    source,
    outboundSource: outboundSourceNumbers[0],
    outboundSourceIndex: 0,
    queueNumber: outboundSourceNumbers[0],
    ringMuted: false,
    muted: false,
    hold: false,
    busyAfterHangup: false,
    redMarked: false,
    showDialer: false,
    incomingStartedAt: 0,
    callStartedAt: 0,
    outboundStartedAt: 0,
    mutedStartedAt: 0,
    holdStartedAt: 0,
    transferStatusText: "",
  });
  state.workspace.incomingDemoActive = false;
  resetTransferDemoState();
  setToast(source === "mobile" ? "手机签入成功" : "PC签入成功");
}

function signOut() {
  clearWrapupTimer();
  clearTimeout(startOutbound.timer);
  resetWorkRecordPlayer(true);
  Object.assign(state.workspace.telephony, {
    status: "unsigned",
    source: "",
    outboundSource: outboundSourceNumbers[0],
    outboundSourceIndex: 0,
    queueNumber: outboundSourceNumbers[0],
    ringMuted: false,
    muted: false,
    hold: false,
    busyAfterHangup: false,
    redMarked: false,
    showDialer: false,
    incomingStartedAt: 0,
    callStartedAt: 0,
    outboundStartedAt: 0,
    mutedStartedAt: 0,
    holdStartedAt: 0,
    transferStatusText: "",
  });
  state.workspace.incomingDemoActive = false;
  resetTransferDemoState();
  state.workspace.activeModal = "";
  state.workspace.transferPageOpen = false;
  state.workspace.settingsPageOpen = false;
  state.workspace.collectPageOpen = false;
  state.workspace.helpPageOpen = false;
  state.workspace.nav = "dashboard";
  setToast("已签出");
}

function logoutToLogin() {
  signOut();
  state.route = "login";
  saveRoute();
}

function clearCollectSelection() {
  state.workspace.collectSelectedIds = [];
  state.workspace.collectRemark = "";
}

function openCollectPage(acceptedNumber = "") {
  state.workspace.transferPageOpen = false;
  state.workspace.settingsPageOpen = false;
  state.workspace.collectPageOpen = true;
  state.workspace.helpPageOpen = false;
  state.workspace.activeModal = "";
  state.workspace.collectTab = "current";
  state.workspace.collectSidebar = "favorites";
  state.workspace.collectTreeSelection = "favorites";
  state.workspace.collectExpandedKeys = [...collectExpandedDefaultKeys];
  state.workspace.collectKeyword = "";
  state.workspace.collectAcceptedNumber = acceptedNumber;
  state.workspace.collectSelectedIds = [...collectDefaultSelectedIds];
  state.workspace.collectRemark = "";
  state.workspace.collectKeepRecording = true;
}

function closeCollectPage() {
  state.workspace.collectPageOpen = false;
}

function workRecordCallbackNumber(row) {
  return row.direction === "呼入" ? row.caller : row.callee;
}

function parseRecordDate(value) {
  if (!value) return null;
  return new Date(value.replace(/-/g, "/"));
}

function filteredWorkRecordRows() {
  return workRecordTableRows.filter((row) => {
    if (state.workspace.workRecordCaller && !row.caller.includes(state.workspace.workRecordCaller.trim())) return false;
    if (state.workspace.workRecordCallee && !row.callee.includes(state.workspace.workRecordCallee.trim())) return false;
    if (state.workspace.workRecordSatisfactionType && row.satisfactionType !== state.workspace.workRecordSatisfactionType) return false;
    if (state.workspace.workRecordCallType && row.callType !== state.workspace.workRecordCallType) return false;
    if (state.workspace.workRecordHangupReason && row.hangupReason !== state.workspace.workRecordHangupReason) return false;
    if (state.workspace.workRecordCity && row.city !== state.workspace.workRecordCity) return false;
    if (state.workspace.workRecordCollected && row.collected !== state.workspace.workRecordCollected) return false;
    if (state.workspace.workRecordCrossProvince && row.crossProvince !== state.workspace.workRecordCrossProvince) return false;
    if (state.workspace.workRecordProvince && row.province !== state.workspace.workRecordProvince) return false;
    const fromDate = parseRecordDate(state.workspace.workRecordDateFrom);
    const toDate = parseRecordDate(state.workspace.workRecordDateTo);
    const rowDate = parseRecordDate(row.callTime);
    if (toDate && /00:00:00$/.test(state.workspace.workRecordDateTo)) {
      toDate.setHours(23, 59, 59, 999);
    }
    if (fromDate && rowDate && rowDate < fromDate) return false;
    if (toDate && rowDate && rowDate > toDate) return false;
    return true;
  });
}

function resetWorkRecordFilters() {
  state.workspace.workRecordCaller = "";
  state.workspace.workRecordCallee = "";
  state.workspace.workRecordSatisfactionType = "";
  state.workspace.workRecordCallType = "";
  state.workspace.workRecordHangupReason = "";
  state.workspace.workRecordCity = "";
  state.workspace.workRecordCollected = "";
  state.workspace.workRecordCrossProvince = "";
  state.workspace.workRecordProvince = "";
  state.workspace.workRecordDateFrom = "2023-02-05 00:00:00";
  state.workspace.workRecordDateTo = "2023-02-05 00:00:00";
}

function activeWorkRecordPlayerRow() {
  return workRecordTableRows.find((item) => item.id === state.workspace.workRecordPlayerRowId) || null;
}

function formatPlayerTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const hh = Math.floor(safe / 3600);
  const mm = Math.floor((safe % 3600) / 60);
  const ss = safe % 60;
  if (hh > 0) return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function workRecordPlayerProgress() {
  const duration = state.workspace.workRecordPlayerDuration || 0;
  if (!duration) return 0;
  return Math.min(100, (state.workspace.workRecordPlayerCurrentTime / duration) * 100);
}

function resetWorkRecordPlayer(close = true) {
  state.workspace.workRecordPlayingId = "";
  state.workspace.workRecordPlayerPaused = true;
  state.workspace.workRecordPlayerStatus = "stopped";
  state.workspace.workRecordPlayerCurrentTime = 0;
  state.workspace.workRecordPlayerDuration = 0;
  state.workspace.workRecordPlayerRowId = "";
  state.workspace.workRecordPlayerLastTick = 0;
  if (close) {
    state.workspace.workRecordPlayerOpen = false;
    state.workspace.workRecordPlayerMinimized = false;
  }
}

function startWorkRecordPlayer(rowId) {
  const row = workRecordTableRows.find((item) => item.id === rowId);
  if (!row) return;
  state.workspace.workRecordPlayingId = row.id;
  state.workspace.workRecordPlayerOpen = true;
  state.workspace.workRecordPlayerMinimized = false;
  state.workspace.workRecordPlayerPaused = false;
  state.workspace.workRecordPlayerStatus = "playing";
  state.workspace.workRecordPlayerRate = 1;
  state.workspace.workRecordPlayerCurrentTime = 0;
  state.workspace.workRecordPlayerDuration = Math.max(Number(row.duration) || 0, 30);
  state.workspace.workRecordPlayerRowId = row.id;
  state.workspace.workRecordPlayerLastTick = Date.now();
  setToast(`正在播放通话录音：${row.callTime}`);
}

function pauseWorkRecordPlayer() {
  if (!state.workspace.workRecordPlayerOpen) return;
  state.workspace.workRecordPlayerPaused = true;
  state.workspace.workRecordPlayerStatus = "paused";
  state.workspace.workRecordPlayerLastTick = 0;
}

function resumeWorkRecordPlayer() {
  if (!state.workspace.workRecordPlayerOpen || !state.workspace.workRecordPlayerRowId) return;
  if (state.workspace.workRecordPlayerCurrentTime >= state.workspace.workRecordPlayerDuration) {
    state.workspace.workRecordPlayerCurrentTime = 0;
  }
  state.workspace.workRecordPlayerPaused = false;
  state.workspace.workRecordPlayerStatus = "playing";
  state.workspace.workRecordPlayerLastTick = Date.now();
}

function stopWorkRecordPlayer() {
  if (!state.workspace.workRecordPlayerOpen) return;
  state.workspace.workRecordPlayingId = "";
  state.workspace.workRecordPlayerPaused = true;
  state.workspace.workRecordPlayerStatus = "stopped";
  state.workspace.workRecordPlayerCurrentTime = 0;
  state.workspace.workRecordPlayerLastTick = 0;
}

function closeWorkRecordPlayer() {
  resetWorkRecordPlayer(true);
}

function fastForwardWorkRecordPlayer(seconds = 15) {
  if (!state.workspace.workRecordPlayerOpen) return;
  state.workspace.workRecordPlayerCurrentTime = Math.min(
    state.workspace.workRecordPlayerDuration,
    state.workspace.workRecordPlayerCurrentTime + seconds,
  );
  state.workspace.workRecordPlayerLastTick = state.workspace.workRecordPlayerPaused ? 0 : Date.now();
}

function setWorkRecordPlayerRate(rate) {
  if (!state.workspace.workRecordPlayerOpen) return;
  state.workspace.workRecordPlayerRate = rate;
  state.workspace.workRecordPlayerLastTick = state.workspace.workRecordPlayerPaused ? 0 : Date.now();
}

function startWorkRecordCallback(rowId) {
  const row = workRecordTableRows.find((item) => item.id === rowId);
  if (!row) return;
  state.workspace.telephony.dialNumber = workRecordCallbackNumber(row);
  if (!signedIn()) signIn("pc");
  startOutbound();
}

function openWorkRecordCollect(rowId) {
  const row = workRecordTableRows.find((item) => item.id === rowId);
  openCollectPage(row?.callee || "");
}

function toggleWorkRecordPlayback(rowId) {
  startWorkRecordPlayer(rowId);
}

function openHelpPage() {
  state.workspace.transferPageOpen = false;
  state.workspace.settingsPageOpen = false;
  state.workspace.helpPageOpen = true;
  state.workspace.collectPageOpen = false;
  state.workspace.activeModal = "";
}

function closeHelpPage() {
  state.workspace.helpPageOpen = false;
}

function openSettingsPage() {
  state.workspace.transferPageOpen = false;
  state.workspace.settingsPageOpen = true;
  state.workspace.helpPageOpen = false;
  state.workspace.collectPageOpen = false;
  state.workspace.activeModal = "";
  state.workspace.settingsTab = "general";
}

function closeSettingsPage() {
  state.workspace.settingsPageOpen = false;
}

function openTransferPage() {
  state.workspace.transferPageOpen = true;
  state.workspace.settingsPageOpen = false;
  state.workspace.helpPageOpen = false;
  state.workspace.collectPageOpen = false;
  state.workspace.activeModal = "";
  state.workspace.transferTab = "seat";
}

function closeTransferPage() {
  state.workspace.transferPageOpen = false;
}

function selectedTransferSeatRow() {
  return transferSeatPageRows.find((item) => state.workspace.transferSeatSelectedIds.includes(item.id)) || null;
}

function syncTransferStatusText() {
  const telephony = state.workspace.telephony;
  const stage = state.workspace.transferDemoStage;
  if (stage === "waiting-answer") {
    telephony.transferStatusText = "正在互助转接等待中";
    return;
  }
  if (stage === "helping") {
    telephony.transferStatusText = "互助中";
    return;
  }
  if (stage === "three-way") {
    telephony.transferStatusText = "三方通话中";
    return;
  }
  telephony.transferStatusText = "";
}

function resetTransferDemoState() {
  state.workspace.transferDemoStage = "idle";
  state.workspace.transferDemoSeatId = "";
  state.workspace.transferDemoSeatName = "";
  state.workspace.transferDemoSeatCode = "";
  state.workspace.transferDemoRemark = "";
  syncTransferStatusText();
}

function startIncomingDemoCall() {
  const number = (state.workspace.incomingDemoNumber || "").trim();
  const telephony = state.workspace.telephony;
  if (!number) {
    setToast("请输入演示号码");
    return;
  }
  if (telephony.status === "talking" || telephony.status === "outbound" || telephony.status === "incoming") {
    setToast("当前已有通话");
    return;
  }
  if (!signedIn()) signIn("pc");
  clearTimeout(startOutbound.timer);
  clearWrapupTimer();
  resetCallInteractionState();
  resetTransferDemoState();
  telephony.status = "incoming";
  telephony.callNumber = number;
  telephony.incomingStartedAt = Date.now();
  telephony.callStartedAt = 0;
  telephony.outboundStartedAt = 0;
  state.workspace.incomingDemoActive = true;
  setToast("呼入演示已进入等待接话");
}

function answerIncomingDemoCall() {
  const telephony = state.workspace.telephony;
  if (telephony.status !== "incoming") return;
  telephony.status = "talking";
  telephony.callStartedAt = Date.now();
  telephony.incomingStartedAt = 0;
  setToast("已接听呼入演示");
}

function rejectIncomingDemoCall() {
  const telephony = state.workspace.telephony;
  if (telephony.status !== "incoming") return;
  clearIncomingDemoState();
  telephony.status = "idle";
  telephony.callStartedAt = 0;
  telephony.outboundStartedAt = 0;
  telephony.transferStatusText = "";
  resetCallInteractionState();
  setToast("已挂机来电");
}

function setTransferAssistStage(stage) {
  state.workspace.transferDemoStage = stage;
  syncTransferStatusText();
}

function openTransferAssistDemo() {
  const telephony = state.workspace.telephony;
  const selectedSeat = selectedTransferSeatRow();
  if (telephony.status !== "talking") {
    setToast("请在通话中发起互助转接");
    return;
  }
  if (!selectedSeat) {
    setToast("请先选择转接坐席");
    return;
  }
  state.workspace.transferDemoSeatId = selectedSeat.id;
  state.workspace.transferDemoSeatName = selectedSeat.name;
  state.workspace.transferDemoSeatCode = selectedSeat.code;
  state.workspace.transferDemoRemark = state.workspace.transferSeatExtraInfo.trim();
  state.workspace.transferDemoMinimized = false;
  setTransferAssistStage("waiting-answer");
  setToast("已发起互助转接");
}

function answerTransferAssistDemo() {
  if (state.workspace.transferDemoStage !== "waiting-answer") return;
  setTransferAssistStage("helping");
  setToast("互助坐席已接话");
}

function startThreeWayTransferAssist() {
  if (state.workspace.transferDemoStage !== "helping") return;
  setTransferAssistStage("three-way");
  setToast("已进入三方通话");
}

function cancelTransferAssistDemo() {
  if (state.workspace.transferDemoStage === "idle") return;
  resetTransferDemoState();
  setToast("已取消互助转接");
}

function handleTransferDemoRemoteHangup() {
  if (state.workspace.transferDemoStage === "idle") return;
  resetTransferDemoState();
  setToast("互助转接已结束");
}

function toggleSelection(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function toggleSingleSelection(list, value) {
  return list.includes(value) ? [] : [value];
}

function cloneSkillEditorMap(source = {}) {
  return Object.fromEntries(
    skillEditorColumns.map((column) => [column.key, [...(source[column.key] || [])]]),
  );
}

function cloneSkillSummaryGroups(source = skillGroups) {
  return source.map((group) => ({
    ...group,
    items: [...group.items],
  }));
}

function collectSkillEditorLeafKeys(nodes) {
  return nodes.flatMap((node) => (node.children?.length ? collectSkillEditorLeafKeys(node.children) : [node.key]));
}

function flattenSkillEditorLeaves(nodes) {
  return nodes.flatMap((node) => (
    node.children?.length
      ? flattenSkillEditorLeaves(node.children)
      : [{ key: node.key, label: node.label }]
  ));
}

function findSkillEditorNode(nodes, key) {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const nested = findSkillEditorNode(node.children, key);
      if (nested) return nested;
    }
  }
  return null;
}

function buildSkillSummaryGroupsFromSelections(selectionMap) {
  const selectedLabels = (columnKey) => {
    const column = skillEditorColumns.find((item) => item.key === columnKey);
    if (!column) return [];
    const selectedSet = new Set(selectionMap[column.key] || []);
    return flattenSkillEditorLeaves(column.tree)
      .filter((item) => selectedSet.has(item.key))
      .map((item) => item.label);
  };

  const voiceColumn = skillEditorColumns.find((item) => item.key === "voice");
  const textColumn = skillEditorColumns.find((item) => item.key === "text");
  const videoColumn = skillEditorColumns.find((item) => item.key === "video");
  const voiceBaseGroup = skillGroups.find((group) => group.key === "voice-services") || skillGroups[0];
  const onlineBaseGroup = skillGroups.find((group) => group.key === "online-services") || skillGroups[1];

  return [
    {
      key: voiceBaseGroup.key,
      title: voiceBaseGroup.title,
      items: [...new Set([
        ...voiceBaseGroup.items,
        ...(voiceColumn?.fixedItems || []),
        ...selectedLabels("voice"),
      ])],
    },
    {
      key: onlineBaseGroup.key,
      title: onlineBaseGroup.title,
      items: [...new Set([
        ...onlineBaseGroup.items,
        ...(textColumn?.fixedItems || []),
        ...selectedLabels("text"),
        ...(videoColumn?.fixedItems || []),
        ...selectedLabels("video"),
      ])],
    },
  ];
}

function skillEditorNodeState(columnKey, node) {
  const selected = new Set(state.workspace.skillEditorDraftSelectedKeys[columnKey] || []);
  const leafKeys = node.children?.length ? collectSkillEditorLeafKeys(node.children) : [node.key];
  if (leafKeys.every((key) => selected.has(key))) return "checked";
  if (leafKeys.some((key) => selected.has(key))) return "partial";
  return "empty";
}

function toggleSkillEditorItem(columnKey, nodeKey) {
  const column = skillEditorColumns.find((item) => item.key === columnKey);
  if (!column) return;
  const node = findSkillEditorNode(column.tree, nodeKey);
  if (!node) return;
  const leafKeys = node.children?.length ? collectSkillEditorLeafKeys(node.children) : [node.key];
  const current = new Set(state.workspace.skillEditorDraftSelectedKeys[columnKey] || []);
  const shouldSelect = !leafKeys.every((key) => current.has(key));
  leafKeys.forEach((key) => {
    if (shouldSelect) current.add(key);
    else current.delete(key);
  });
  state.workspace.skillEditorDraftSelectedKeys = {
    ...state.workspace.skillEditorDraftSelectedKeys,
    [columnKey]: [...current],
  };
}

function openSkillEditorModal() {
  state.workspace.skillEditorDraftSelectedKeys = cloneSkillEditorMap(state.workspace.skillEditorSelectedKeys);
  state.workspace.activeModal = "skill-editor";
}

function toggleSkillSummaryBranch(key) {
  const expandedKeys = new Set(state.workspace.skillSummaryExpandedKeys || []);
  if (expandedKeys.has(key)) expandedKeys.delete(key);
  else expandedKeys.add(key);
  state.workspace.skillSummaryExpandedKeys = [...expandedKeys];
}

function toggleCollectItem(id) {
  const selected = new Set(state.workspace.collectSelectedIds);
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }
  state.workspace.collectSelectedIds = [...selected];
}

function flattenCollectLeafItems(nodes, parentPath = []) {
  return nodes.flatMap((node) => {
    const nextPath = [...parentPath, node.label];
    if (!node.children?.length) {
      return [{ id: node.key, path: nextPath.join("->"), label: node.label }];
    }
    return flattenCollectLeafItems(node.children, nextPath);
  });
}

function findCollectNodeByKey(nodes, key, parentPath = []) {
  for (const node of nodes) {
    if (node.key === key) return { node, parentPath };
    if (node.children?.length) {
      const match = findCollectNodeByKey(node.children, key, [...parentPath, node.label]);
      if (match) return match;
    }
  }
  return null;
}

function collectLeafMap() {
  return new Map(flattenCollectLeafItems(collectReasonTree).map((item) => [item.id, item]));
}

function collectVisibleItems() {
  if (state.workspace.collectTreeSelection === "favorites") {
    return collectFavoriteLeafKeys.map((id) => collectLeafMap().get(id)).filter(Boolean);
  }
  const match = findCollectNodeByKey(collectReasonTree, state.workspace.collectTreeSelection);
  if (!match) return collectFavoriteLeafKeys.map((id) => collectLeafMap().get(id)).filter(Boolean);
  if (!match.node.children?.length) {
    return [{ id: match.node.key, path: [...match.parentPath, match.node.label].join("->"), label: match.node.label }];
  }
  return flattenCollectLeafItems(match.node.children, [...match.parentPath, match.node.label]);
}

function renderCollectTreeNodes(nodes, level = 0) {
  return nodes.map((node) => {
    const hasChildren = Boolean(node.children?.length);
    const expanded = state.workspace.collectExpandedKeys.includes(node.key);
    const active = state.workspace.collectTreeSelection === node.key;
    return `
      <div class="collect-tree__node">
        <div class="collect-tree__row ${active ? "is-active" : ""}" style="--collect-indent:${level}">
          ${hasChildren ? `
            <button class="collect-tree__toggle ${expanded ? "is-open" : ""}" data-action="collect-toggle-branch" data-value="${node.key}" title="展开收起">
              ${icon("chevron-down")}
            </button>
          ` : `<span class="collect-tree__toggle collect-tree__toggle--empty"></span>`}
          <button class="collect-tree__label" data-action="collect-tree-select" data-value="${node.key}">${node.label}</button>
        </div>
        ${hasChildren && expanded ? `<div class="collect-tree__children">${renderCollectTreeNodes(node.children, level + 1)}</div>` : ""}
      </div>
    `;
  }).join("");
}

function setCallMute(active) {
  const telephony = state.workspace.telephony;
  if (active && telephony.hold) {
    telephony.hold = false;
    telephony.holdStartedAt = 0;
  }
  telephony.muted = active;
  telephony.mutedStartedAt = active ? Date.now() : 0;
}

function setCallHold(active) {
  const telephony = state.workspace.telephony;
  if (active && telephony.muted) {
    telephony.muted = false;
    telephony.mutedStartedAt = 0;
  }
  telephony.hold = active;
  telephony.holdStartedAt = active ? Date.now() : 0;
}

function startOutbound() {
  const telephony = state.workspace.telephony;
  clearWrapupTimer();
  resetCallInteractionState();
  if (!telephony.dialNumber.trim()) {
    setToast("请输入要外呼的号码");
    return;
  }
  telephony.status = "outbound";
  telephony.callNumber = telephony.dialNumber.trim();
  telephony.incomingStartedAt = 0;
  telephony.outboundStartedAt = Date.now();
  telephony.callStartedAt = 0;
  telephony.transferStatusText = "";
  telephony.showDialer = false;
  state.workspace.incomingDemoActive = false;
  resetTransferDemoState();
  render();
  clearTimeout(startOutbound.timer);
  startOutbound.timer = window.setTimeout(() => {
    if (state.workspace.telephony.status === "outbound") {
      state.workspace.telephony.status = "talking";
      state.workspace.telephony.callStartedAt = Date.now();
      render();
    }
  }, 3000);
}

function hangupCall(mode = "normal") {
  const telephony = state.workspace.telephony;
  const busyAfterHangup = telephony.busyAfterHangup;
  clearTimeout(startOutbound.timer);
  clearWrapupTimer();
  telephony.status = busyAfterHangup ? "busy" : "wrapup";
  telephony.incomingStartedAt = 0;
  telephony.callStartedAt = 0;
  telephony.outboundStartedAt = 0;
  telephony.transferStatusText = "";
  resetCallInteractionState();
  state.workspace.incomingDemoActive = false;
  resetTransferDemoState();
  if (!busyAfterHangup) {
    hangupCall.wrapupTimer = window.setTimeout(() => {
      if (state.workspace.telephony.status === "wrapup") {
        state.workspace.telephony.status = "idle";
        render();
      }
    }, 5000);
  }
  if (!state.workspace.collectPageOpen) {
    state.workspace.nav = "dashboard";
    state.workspace.transferPageOpen = false;
    state.workspace.settingsPageOpen = false;
    state.workspace.helpPageOpen = false;
  }
  setToast("通话已结束");
}

function renderSigninPill(type, label, extraClass = "") {
  const iconName = type === "pc" ? "computer" : "mobile-device";
  return `
    <button class="signin-pill ${extraClass}" data-action="signin-${type}">
      <span class="signin-pill__icon">${icon(iconName)}</span>
      <span>${label}</span>
    </button>
  `;
}

function renderTelephonyButton({ action, title, type, active = false, color = "", danger = false }) {
  const classes = ["telephony-tool"];
  if (active) classes.push("is-active");
  if (color) classes.push(color);
  if (danger) classes.push("is-danger");
  return `<button class="${classes.join(" ")}" data-action="${action}" title="${title}">${toolIcon(type)}</button>`;
}

function renderTable(headers, rows, className = "", actionColumnIndex = -1) {
  return `
    <div class="table-wrap ${className}">
      <table class="quality-table ${className.includes("compact") ? "quality-table--compact" : ""}">
        <thead>
          <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map((cell, index) => `
                <td class="${index === 5 || index === 6 || index === 11 ? "is-ellipsis" : ""}">
                  ${index === actionColumnIndex ? `<button class="table-link" data-action="table-op">${cell}</button>` : cell}
                </td>
              `).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderUnsignedBar() {
  return `
    <div class="telephony-bar telephony-bar--unsigned">
      ${renderSigninPill("pc", "PC签入")}
      ${renderSigninPill("mobile", "15605910268 手机签入", "is-secondary")}
    </div>
  `;
}

function renderIdleOrBusyBar() {
  const telephony = state.workspace.telephony;
  const busy = telephony.status === "busy";
  const ringLabel = telephony.muted ? "取消静音" : "铃声静音";
  return `
    <div class="telephony-bar ${busy ? "telephony-bar--busy" : "telephony-bar--idle"}">
      <div class="telephony-strip">
        <div class="telephony-tools">
          ${renderTelephonyButton({ action: "toggle-busy", title: busy ? "示闲" : "示忙", type: busy ? "show-idle" : "busy", active: busy, color: busy ? "is-primary" : "" })}
          ${renderTelephonyButton({ action: "toggle-dialer", title: "外呼", type: "outbound", active: telephony.showDialer, color: telephony.showDialer ? "is-primary" : "" })}
          ${renderTelephonyButton({ action: "toggle-ring", title: ringLabel, type: "ring", active: telephony.muted, color: telephony.muted ? "is-danger" : "" })}
          ${renderTelephonyButton({ action: "open-signout", title: "签出", type: "signout", color: "is-success" })}
        </div>
        <div class="telephony-spacer"></div>
      </div>
      ${telephony.showDialer ? `
        ${renderFloatingDialer()}
      ` : ""}
    </div>
  `;
}

function renderFloatingDialer() {
  const telephony = state.workspace.telephony;
  return `
    <div class="telephony-subbar telephony-subbar--dialer telephony-dialer">
      <div class="telephony-dialer__row telephony-dialer__row--sources">
        <span class="telephony-dialer__label">主叫号码</span>
        ${outboundSourceNumbers.map((item, index) => `
          <button
            class="${telephony.outboundSourceIndex === index ? "telephony-number-pill is-active" : "telephony-dialer__source-item"}"
            data-action="select-outbound-source"
            data-value="${item}"
            data-index="${index}"
          >
            ${item}
          </button>
        `).join("")}
      </div>
      <div class="telephony-dialer__row telephony-dialer__row--input">
        <span class="telephony-dialer__label">被叫号码</span>
        <input
          class="telephony-dialer__input telephony-dialer__input--floating"
          data-model="dialNumber"
          value="${telephony.dialNumber}"
          placeholder="请输入"
        />
        <button class="telephony-action telephony-action--dark" data-action="toggle-keypad" title="拨号盘">
          <span>${icon("dialpad")}</span>
        </button>
        <button class="telephony-action is-call telephony-action--outbound" data-action="start-outbound" title="外呼">
          <span>${toolAsset(telephonyAssets.outbound, "telephony-tool__asset--medium")}</span>
        </button>
        <button class="telephony-action telephony-action--dark" data-action="clear-dialer" title="清空">
          <span>${icon("back")}</span>
        </button>
      </div>
    </div>
  `;
}

function renderTalkingPills() {
  return `
    <div class="telephony-choice telephony-choice--top">
      <button class="telephony-choice__button is-active">归属 福建福州 0591</button>
      <button class="telephony-choice__button is-active">漫游 福建福州 0591</button>
    </div>
  `;
}

function renderTalkingSideinfo(options = {}) {
  const { showCollect = true } = options;
  return `
    <div class="telephony-sideinfo telephony-sideinfo--talking">
      ${showCollect ? `
        <button class="telephony-sideinfo__collect" data-action="open-collect">
          <span class="telephony-sideinfo__collect-icon">${icon("doc")}</span>
          <span>采集</span>
        </button>
      ` : ""}
      <span class="telephony-sideinfo__counter">呼入次数</span>
      <span>3/24h</span>
      <span>5/7d</span>
    </div>
  `;
}

function renderTalkingBar() {
  const telephony = state.workspace.telephony;
  const outbound = telephony.status === "outbound";
  const numberClass = outbound ? "telephony-call__number is-danger" : "telephony-call__number";
  return `
    <div class="telephony-bar telephony-bar--talking">
      <div class="telephony-strip">
        <div class="telephony-call">
          <span class="telephony-call__queue">${telephony.queueNumber}<span style="margin-left:4px;">▼</span></span>
          <span class="${numberClass}">
            ${icon("phone")}
            <strong>${telephony.callNumber}</strong>
            <em data-call-duration>${callDuration()}</em>
          </span>
        </div>
        <div class="telephony-tools">
          ${renderTelephonyButton({ action: "toggle-call-mute", title: telephony.muted ? "取消静音" : "静音", type: "mute", active: telephony.muted })}
          ${renderTelephonyButton({ action: "toggle-hold", title: telephony.hold ? "取消保持" : "保持", type: "hold", active: telephony.hold })}
          ${renderTelephonyButton({ action: "call-monitor", title: "监听", type: "monitor" })}
          ${renderTelephonyButton({ action: "open-transfer", title: "转接", type: "transfer" })}
          ${renderTelephonyButton({ action: "call-assist", title: "呼叫辅助", type: "assist" })}
          ${renderTelephonyButton({ action: "hangup", title: "挂断", type: "hangup" })}
          ${renderTelephonyButton({ action: "toggle-red", title: "红名单", type: "red", active: telephony.redMarked, danger: true })}
        </div>
        ${renderTalkingSideinfo()}
      </div>
    </div>
  `;
}

function renderIdleOrBusyBarV2() {
  const telephony = state.workspace.telephony;
  const busy = telephony.status === "busy";
  const wrapup = telephony.status === "wrapup";
  const ringLabel = telephony.ringMuted ? "取消静音" : "铃声静音";
  return `
    <div class="telephony-bar ${busy ? "telephony-bar--busy" : "telephony-bar--idle"} ${wrapup ? "telephony-bar--wrapup" : ""}">
      <div class="telephony-strip">
        <div class="telephony-tools">
          ${wrapup ? renderTelephonyButton({ action: "set-idle-now", title: "示闲", type: "show-idle", color: "is-primary" }) : ""}
          ${renderTelephonyButton({ action: "toggle-busy", title: busy ? "示闲" : "示忙", type: busy ? "show-idle" : "busy", active: busy, color: busy ? "is-primary" : "" })}
          ${renderTelephonyButton({ action: "toggle-dialer", title: "外呼", type: "outbound", active: telephony.showDialer, color: telephony.showDialer ? "is-primary" : "" })}
          ${renderTelephonyButton({ action: "toggle-ring", title: ringLabel, type: "ring", active: telephony.ringMuted, color: telephony.ringMuted ? "is-danger" : "" })}
          ${renderTelephonyButton({ action: "open-signout", title: "签出", type: "signout", color: "is-success" })}
        </div>
        <div class="telephony-spacer"></div>
      </div>
      ${telephony.showDialer ? `
        ${renderFloatingDialer()}
      ` : ""}
    </div>
  `;
}

function renderOutboundBarV2() {
  const telephony = state.workspace.telephony;
  return `
    <div class="telephony-bar telephony-bar--talking telephony-bar--outbound">
      <div class="telephony-strip">
        <div class="telephony-call">
          <span class="telephony-call__queue">${telephony.queueNumber}<span style="margin-left:4px;">▼</span></span>
          <span class="telephony-call__number is-outbound">
            ${icon("phone")}
            <strong>${telephony.callNumber}</strong>
            <em data-call-duration>${callDuration()}</em>
            ${renderTelephonyTransferStatus()}
          </span>
        </div>
        <div class="telephony-tools">
          ${renderTelephonyButton({ action: "hangup", title: "挂机", type: "hangup", color: "is-danger" })}
        </div>
        ${renderTalkingSideinfo()}
      </div>
    </div>
  `;
}

function renderIncomingBarV2() {
  const telephony = state.workspace.telephony;
  return `
    <div class="telephony-bar telephony-bar--talking telephony-bar--incoming">
      <div class="telephony-strip">
        <div class="telephony-call">
          <span class="telephony-call__queue">${telephony.queueNumber}<span style="margin-left:4px;">▼</span></span>
          <span class="telephony-call__number is-ringing">
            ${icon("phone")}
            <strong>${telephony.callNumber}</strong>
            <em data-call-duration>${callDuration()}</em>
          </span>
        </div>
        <div class="telephony-tools telephony-tools--incoming">
          ${renderTelephonyButton({ action: "answer-incoming-call", title: "接话", type: "outbound", color: "is-success" })}
          ${renderTelephonyButton({ action: "reject-incoming-call", title: "挂机", type: "hangup", color: "is-danger" })}
        </div>
        ${renderTalkingSideinfo({ showCollect: false })}
      </div>
    </div>
  `;
}

function renderTalkingBarV2() {
  const telephony = state.workspace.telephony;
  return `
    <div class="telephony-bar telephony-bar--talking">
      <div class="telephony-strip">
        <div class="telephony-call">
          <span class="telephony-call__queue">${telephony.queueNumber}<span style="margin-left:4px;">▼</span></span>
          <span class="telephony-call__number">
            ${icon("phone")}
            <strong>${telephony.callNumber}</strong>
            <em data-call-duration>${callDuration()}</em>
            ${renderTelephonyTransferStatus()}
          </span>
        </div>
        <div class="telephony-tools">
          ${renderTelephonyButton({ action: "toggle-call-mute", title: telephony.muted ? "取消静音" : "静音", type: "mute", active: telephony.muted, color: telephony.muted ? "is-warning" : "" })}
          ${renderTelephonyButton({ action: "toggle-hold", title: telephony.hold ? "取消保持" : "保持", type: "hold", active: telephony.hold, color: telephony.hold ? "is-warning" : "" })}
          ${renderTelephonyButton({ action: "open-call-records", title: "通话记录", type: "record" })}
          ${renderTelephonyButton({ action: "open-transfer", title: "转接", type: "transfer" })}
          ${renderTelephonyButton({ action: "toggle-busy-after", title: telephony.busyAfterHangup ? "示闲" : "示忙", type: telephony.busyAfterHangup ? "show-idle" : "busy", active: telephony.busyAfterHangup, color: telephony.busyAfterHangup ? "is-warning" : "" })}
          ${renderTelephonyButton({ action: "hangup", title: "挂机", type: "hangup", color: "is-danger" })}
          ${renderTelephonyButton({ action: "hangup-rated", title: "满意度挂机", type: "rate-hangup", color: "is-danger" })}
        </div>
        ${renderTalkingSideinfo()}
      </div>
    </div>
  `;
}

function renderTelephonyBar() {
  const status = state.workspace.telephony.status;
  if (status === "unsigned") return renderUnsignedBar();
  if (status === "idle" || status === "busy" || status === "wrapup") return renderIdleOrBusyBarV2();
  if (status === "incoming") return renderIncomingBarV2();
  if (status === "outbound") return renderOutboundBarV2();
  return renderTalkingBarV2();
}

function renderSkillSummaryTree(groups) {
  return `
    <div class="skill-summary-tree">
      ${groups.map((group) => {
        const expanded = (state.workspace.skillSummaryExpandedKeys || []).includes(group.key);
        return `
          <section class="skill-summary-branch">
            <button class="skill-summary-branch__header" data-action="skill-summary-toggle" data-value="${group.key}">
              <span class="skill-summary-branch__toggle ${expanded ? "is-open" : ""}">${icon("chevron-down")}</span>
              <span class="skill-summary-branch__title">${group.title}</span>
            </button>
            ${expanded ? `
              <div class="skill-summary-branch__children">
                ${group.items.map((item) => `<div class="skill-summary-leaf">${item}</div>`).join("")}
              </div>
            ` : ""}
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderProfileColumn() {
  const groups = state.workspace.skillSummaryGroups?.length ? state.workspace.skillSummaryGroups : skillGroups;
  return `
    <div class="profile-column">
      <section class="profile-card">
        <button class="profile-card__edit" data-action="profile-edit">${icon("edit")}编辑</button>
        <div class="profile-card__avatar">${icon("headset")}</div>
        <h3>赵某某</h3>
        <p><span class="tag">工号</span>03261</p>
        <p>所属班组：某某班组</p>
      </section>
      <section class="side-panel ${signedIn() ? "" : "is-locked"}">
        <div class="side-panel__tabs">
          <button class="tab-button ${state.workspace.sidePanel === "skills" ? "is-active" : ""}" data-action="panel-skills">所属技能</button>
          <button class="tab-button ${state.workspace.sidePanel === "notes" ? "is-active" : ""}" data-action="panel-notes">记事本</button>
        </div>
        <div class="side-panel__body ${!signedIn() && state.workspace.sidePanel === "skills" ? "side-panel__body--locked" : ""}">
          ${state.workspace.sidePanel === "skills"
              ? signedIn()
                ? `
                  <div class="side-panel__skills">
                    <div class="side-panel__skills-content">${renderSkillSummaryTree(groups)}</div>
                    <button class="side-panel__skill-action" data-action="open-skill-editor">修改技能</button>
                  </div>
                `
              : `
                <div class="side-panel__signin-shell">
                  <div class="side-panel__signin-badge">${icon("headset")}</div>
                  <button class="side-panel__signin" data-action="signin-pc"><span>点击签入</span></button>
                </div>
              `
            : `
              <textarea class="notepad" data-model="note">${state.workspace.note}</textarea>
            `}
        </div>
      </section>
    </div>
  `;
}

function renderSkillEditorTreeNode(column, node, depth = 0) {
  const expanded = (state.workspace.skillEditorExpandedKeys[column.key] || []).includes(node.key);
  const hasChildren = Boolean(node.children?.length);
  const selectionState = skillEditorNodeState(column.key, node);
  return `
    <div class="skill-editor-tree__node">
      <div class="skill-editor-tree__row ${selectionState !== "empty" ? "is-active" : ""}" style="--skill-editor-depth:${depth}">
        <button
          class="skill-editor-tree__toggle ${hasChildren ? (expanded ? "is-open" : "") : "is-empty"}"
          ${hasChildren ? `data-action="skill-editor-toggle-branch" data-column="${column.key}" data-value="${node.key}"` : ""}
        >
          ${hasChildren ? icon("chevron-down") : ""}
        </button>
        <button
          class="skill-editor-tree__check ${selectionState === "checked" ? "is-checked" : selectionState === "partial" ? "is-partial" : ""}"
          data-action="skill-editor-toggle-item"
          data-column="${column.key}"
          data-value="${node.key}"
        >
          ${selectionState === "checked" ? icon("check") : selectionState === "partial" ? "<span></span>" : ""}
        </button>
        <button
          class="skill-editor-tree__label"
          data-action="skill-editor-toggle-item"
          data-column="${column.key}"
          data-value="${node.key}"
        >${node.label}</button>
      </div>
      ${hasChildren && expanded ? `
        <div class="skill-editor-tree__children">
          ${node.children.map((child) => renderSkillEditorTreeNode(column, child, depth + 1)).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderSkillEditorModal() {
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-panel modal-panel--skill-editor" data-modal-panel="true">
        <div class="skill-editor-modal">
          <div class="skill-editor-modal__grid">
            ${skillEditorColumns.map((column) => `
              <section class="skill-editor-column">
                <div class="skill-editor-column__title">
                  <span>${icon(column.icon)}</span>
                  <h4>${column.title}</h4>
                </div>
                <div class="skill-editor-card">
                  <div class="skill-editor-card__head">可选技能</div>
                  <div class="skill-editor-card__body skill-editor-card__body--tree">
                    ${column.tree.map((node) => renderSkillEditorTreeNode(column, node)).join("")}
                  </div>
                </div>
                <div class="skill-editor-card skill-editor-card--fixed">
                  <div class="skill-editor-card__head skill-editor-card__head--muted">固定技能（默认已选）</div>
                  <div class="skill-editor-card__body skill-editor-card__body--fixed">
                    ${column.fixedItems.map((item) => `<div class="skill-editor-fixed__item">${item}</div>`).join("")}
                  </div>
                </div>
              </section>
            `).join("")}
          </div>
          <div class="skill-editor-modal__footer">
            <button class="table-link table-link--ghost" data-action="skill-editor-cancel">取消</button>
            <button class="table-link" data-action="skill-editor-save">确定</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderWorkRecordInput(label, model) {
  return `
    <label class="work-record-filter">
      <span>${label}</span>
      <input data-model="${model}" value="${state.workspace[model] || ""}" placeholder="请输入" />
    </label>
  `;
}

function renderWorkRecordSelect(label, model, options) {
  return `
    <label class="work-record-filter">
      <span>${label}</span>
      <select data-model="${model}">
        <option value="">请选择</option>
        ${options.map((item) => `<option value="${item}" ${state.workspace[model] === item ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderWorkRecordFilters() {
  return `
    <div class="work-record-filters">
      ${renderWorkRecordInput("主叫号码", "workRecordCaller")}
      ${renderWorkRecordInput("被叫号码", "workRecordCallee")}
      ${renderWorkRecordSelect("满意度类型", "workRecordSatisfactionType", workRecordSatisfactionOptions)}
      ${renderWorkRecordSelect("呼叫类型", "workRecordCallType", workRecordCallTypeOptions)}
      ${renderWorkRecordSelect("挂机原因", "workRecordHangupReason", workRecordHangupReasonOptions)}
      ${renderWorkRecordSelect("归属地市", "workRecordCity", workRecordCityOptions)}
      <label class="work-record-filter work-record-filter--range">
        <span>时间范围</span>
        <div class="work-record-range">
          <input data-model="workRecordDateFrom" value="${state.workspace.workRecordDateFrom}" />
          <em>至</em>
          <input data-model="workRecordDateTo" value="${state.workspace.workRecordDateTo}" />
          <i>${icon("calendar")}</i>
        </div>
      </label>
      ${renderWorkRecordSelect("是否采集", "workRecordCollected", workRecordCollectedOptions)}
      ${renderWorkRecordSelect("是否跨省", "workRecordCrossProvince", workRecordCrossProvinceOptions)}
      ${renderWorkRecordSelect("话务归属省份", "workRecordProvince", workRecordProvinceOptions)}
      <div class="work-record-filters__actions">
        <button class="work-record-filters__hint" title="提示">${icon("help")}</button>
        <button class="table-link table-link--ghost work-status__action" data-action="work-record-reset">重置</button>
        <button class="table-link work-status__action" data-action="work-record-query">查询</button>
      </div>
    </div>
  `;
}

function renderWorkRecordTable() {
  const rows = filteredWorkRecordRows();
  return `
    <div class="work-record-table-wrap">
      <table class="work-record-table">
        <thead>
          <tr>
            <th>操作</th>
            <th>采集</th>
            <th>是否跨省</th>
            <th>呼叫类型</th>
            <th>呼入/呼出时间</th>
            <th>归属地市</th>
            <th>主叫号码</th>
            <th>被叫号码</th>
            <th>时长（秒）</th>
            <th>满意度评价</th>
            <th>挂机原因</th>
            <th>结果</th>
            <th>接触轨迹</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>
                <div class="work-record-ops">
                  <button class="work-record-op work-record-op--callback" data-action="work-record-callback" data-id="${row.id}">
                    <span class="work-record-op__icon">${icon("phone-out")}</span>
                    <strong>回呼</strong>
                  </button>
                  <button class="work-record-op work-record-op--collect" data-action="work-record-collect" data-id="${row.id}">
                    <span class="work-record-op__icon">${icon("doc")}</span>
                    <strong>采集</strong>
                  </button>
                </div>
              </td>
              <td>${row.collected}</td>
              <td>${row.crossProvince}</td>
              <td>${row.callType}</td>
              <td>${row.callTime}</td>
              <td>${row.city}</td>
              <td>${row.caller}</td>
              <td>${row.callee}</td>
              <td>${row.duration}</td>
              <td>${row.satisfactionType}</td>
              <td>${row.hangupReason}</td>
              <td>${row.result}</td>
              <td class="is-ellipsis">${row.track}</td>
              <td>
                <button class="work-record-play" data-action="work-record-play" data-id="${row.id}">
                  <span>${icon("play")}</span>
                  <strong>播放</strong>
                </button>
              </td>
            </tr>
          `).join("") || `
            <tr>
              <td colspan="14" class="work-record-table__empty">当前筛选条件下暂无通话记录</td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

function renderWorkRecordSection() {
  return `
    <div class="work-record-section">
      ${renderWorkRecordFilters()}
      ${renderWorkRecordTable()}
    </div>
  `;
}

function renderEfficiencyMetricRows(rows) {
  return `
    <div class="efficiency-metrics">
      ${rows.map((item) => `
        <div class="efficiency-metric">
          <span>${item.label}</span>
          <strong>${item.value}${item.unit ? `<em>${item.unit}</em>` : ""}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEfficiencyPanel(title, tone, iconName, body, panelClass = "") {
  const classes = ["efficiency-card", panelClass].filter(Boolean).join(" ");
  return `
    <section class="${classes}">
      <div class="efficiency-card__title">
        <span class="efficiency-card__icon ${tone}">${icon(iconName)}</span>
        <strong>${title}</strong>
      </div>
      ${body}
    </section>
  `;
}

function renderWorkEfficiencySection() {
  return `
    <div class="efficiency-section">
      <div class="efficiency-toolbar">
        <div class="efficiency-toolbar__range">
          <span class="efficiency-toolbar__calendar">${icon("calendar")}</span>
          <input data-model="workEfficiencyDateFrom" value="${state.workspace.workEfficiencyDateFrom}" />
          <em>至</em>
          <input data-model="workEfficiencyDateTo" value="${state.workspace.workEfficiencyDateTo}" />
        </div>
        <button class="table-link work-status__action" data-action="work-efficiency-query">查询</button>
        <button class="work-record-filters__hint" title="提示">${icon("help")}</button>
      </div>
      ${renderEfficiencyPanel(
        "签入情况",
        "is-blue",
        "phone-in",
        `<div class="efficiency-signin-grid">
          ${efficiencySigninRows.map((item) => `
            <div class="efficiency-signin-item">
              <span>${item.label}</span>
              <strong>${item.value}${item.unit ? `<em>${item.unit}</em>` : ""}</strong>
            </div>
          `).join("")}
        </div>`,
        "efficiency-card--summary",
      )}
      <div class="efficiency-layout">
        <div class="efficiency-layout__left">
          ${renderEfficiencyPanel("话务统计", "is-orange", "phone", renderEfficiencyMetricRows(efficiencyCallRows), "efficiency-card--stats")}
          ${renderEfficiencyPanel("状态统计", "is-green", "chart", renderEfficiencyMetricRows(efficiencyStatusRows), "efficiency-card--stats")}
        </div>
        ${renderEfficiencyPanel(
          "时间分配",
          "is-purple",
          "clock",
          `<div class="efficiency-distribution">
            ${efficiencyDistributionRows.map((item) => `
              <div class="efficiency-distribution__item">
                <span class="efficiency-distribution__dot ${item.tone}"></span>
                <strong>${item.label}</strong>
                <em>${item.time}</em>
                <b>${item.percent}</b>
              </div>
            `).join("")}
          </div>`,
          "efficiency-card--distribution",
        )}
      </div>
    </div>
  `;
}

function renderDashboard() {
  return `
    <div class="workspace-content">
      ${renderProfileColumn()}
      <div class="dashboard-column">
        <section class="dashboard-panel">
          <div class="section-heading">
            <div>
              <h2>语音通话</h2>
              <p>数据更新时间：2022-10-03 13:00:26</p>
            </div>
          </div>
          <div class="metrics-grid">
            ${metricCards.map((item) => `
              <article class="metric-card">
                ${metricIcon(item.icon)}
                <div class="metric-card__content">
                  <strong>${item.value}</strong>
                  <span>${item.label}</span>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
        <section class="dashboard-panel dashboard-panel--full">
          <div class="section-heading">
            <div><h2>质检评定</h2></div>
          </div>
          <div class="filter-grid">
            <label class="filter-field"><span>主叫号码</span><input placeholder="请输入" /></label>
            <label class="filter-field"><span>被叫号码</span><input placeholder="请输入" /></label>
            <label class="filter-field"><span>流水号</span><input placeholder="请输入" /></label>
            <label class="filter-field filter-field--wide">
              <span>时间范围</span>
              <div class="filter-field__input">
                <input placeholder="请选择时间范围" />
                <i>${icon("calendar")}</i>
              </div>
            </label>
            <button class="search-button">${icon("search")}查询</button>
          </div>
          ${renderTable(qualityHeaders, qualityRows)}
        </section>
      </div>
    </div>
  `;
}

function renderWorkStatus() {
  return `
    <div class="workspace-content workspace-content--status">
      <section class="dashboard-panel work-status-panel">
        <div class="work-status__header">
          <div class="work-status__tabs">
            <button class="${state.workspace.workStatusTab === "efficiency" ? "is-active" : ""}" data-action="work-tab-efficiency">工效</button>
            <button class="${state.workspace.workStatusTab === "records" ? "is-active" : ""}" data-action="work-tab-records">通话记录</button>
          </div>
          ${state.workspace.workStatusTab === "efficiency" ? `
            <div class="work-status__filters">
              <label class="toolbar-field toolbar-field--date"><span>统计时间</span><input value="2023-02-05 00:00:00 至 2023-02-05 00:00:00" /></label>
              <button class="table-link">查询</button>
              <button class="table-link table-link--ghost">重置</button>
            </div>
          ` : `
            ${renderWorkRecordFilters()}
          `}
        </div>
        ${state.workspace.workStatusTab === "efficiency" ? `
          <div class="status-grid">
            <div class="dashboard-column">
              <section class="work-card">
                <div class="work-card__title">签入情况</div>
                <div class="work-signin-grid">
                  ${workSigninRows.map((item) => `
                    <article class="work-signin-card">
                      <span>${item.label}</span>
                      <strong>${item.value}</strong>
                      <em>${item.unit}</em>
                    </article>
                  `).join("")}
                </div>
              </section>
              <section class="work-card">
                <div class="work-card__title">工作轨迹</div>
                <div class="timeline">
                  ${workTimelineRows.map((item) => `
                    <article class="timeline__item">
                      <div class="timeline__time">${item[0]}</div>
                      <div class="timeline__dot"></div>
                      <div class="timeline__content">
                        <div class="timeline__head"><strong>${item[1]}</strong><span>${item[2]}</span></div>
                        <p>${item[3]}</p>
                      </div>
                    </article>
                  `).join("")}
                </div>
              </section>
            </div>
            <div class="dashboard-column">
              <section class="work-card">
                <div class="work-card__title">时间分配</div>
                <div class="status-list">
                  ${timeDistributionRows.map((item) => `
                    <div class="status-list__item">
                      <span>${item.label}</span>
                      <strong class="${item.label === "离开时长" ? "is-ok" : ""}">${item.value} ${item.unit}</strong>
                    </div>
                  `).join("")}
                </div>
              </section>
              <section class="work-card">
                <div class="work-card__title">设备状态</div>
                <div class="status-list">
                  <div class="status-list__item"><span>耳麦检测</span><strong class="is-ok">正常</strong></div>
                  <div class="status-list__item"><span>振铃静音</span><strong>${state.workspace.telephony.muted ? "已开启" : "未开启"}</strong></div>
                  <div class="status-list__item"><span>网络状态</span><strong class="is-ok">稳定</strong></div>
                </div>
              </section>
            </div>
          </div>
        ` : renderWorkRecordTable()}
      </section>
    </div>
  `;
}

function renderWorkStatusV2() {
  return `
    <div class="workspace-content workspace-content--status">
      <section class="dashboard-panel work-status-panel">
        <div class="work-status__header">
          <div class="work-status__tabs">
            <button class="${state.workspace.workStatusTab === "efficiency" ? "is-active" : ""}" data-action="work-tab-efficiency">工效</button>
            <button class="${state.workspace.workStatusTab === "records" ? "is-active" : ""}" data-action="work-tab-records">通话记录</button>
          </div>
        </div>
        ${state.workspace.workStatusTab === "efficiency" ? renderWorkEfficiencySection() : renderWorkRecordSection()}
      </section>
    </div>
  `;
}

function renderCollectPage() {
  const visibleItems = collectVisibleItems().filter((item) => item.path.includes(state.workspace.collectKeyword.trim() || ""));
  const leafMap = collectLeafMap();
  const selectedItems = state.workspace.collectSelectedIds.map((id) => leafMap.get(id)).filter(Boolean);
  const tabs = [
    { key: "current", label: "本通电话", time: "09:30:00" },
    { key: "related", label: "15605910268", time: "09:30:00" },
  ];
  return `
    <div class="collect-workspace">
      <div class="collect-workspace__tabs">
        <div class="collect-workspace__tablist">
          ${tabs.map((tab) => `
            <button
              class="collect-workspace__tab ${state.workspace.collectTab === tab.key ? "is-active" : ""}"
              data-action="collect-page-tab"
              data-value="${tab.key}"
            >
              <strong>${tab.label}</strong>
              <span>${tab.time}</span>
            </button>
          `).join("")}
        </div>
        <button class="collect-workspace__close" data-action="close-collect-page" title="关闭">${icon("close")}</button>
      </div>
      <div class="collect-workspace__body">
        <aside class="collect-sidebar">
          <button class="collect-favorite-entry ${state.workspace.collectTreeSelection === "favorites" ? "is-active" : ""}" data-action="collect-tree-select" data-value="favorites">
            <span class="collect-favorite-entry__icon">${icon("star-filled")}</span>
            <span>我的收藏</span>
          </button>
          <div class="collect-tree">
            ${renderCollectTreeNodes(collectReasonTree)}
          </div>
          <button class="side-nav side-nav--logout" data-action="logout-to-login">
            <span>${icon("logout")}</span>
            <strong>退出</strong>
          </button>
        </aside>
        <section class="collect-board">
          <div class="collect-board__search">
            <div class="collect-board__search-group">
              <div class="collect-input collect-input--search">
                <input data-model="collectKeyword" value="${state.workspace.collectKeyword}" placeholder="请输入关键字" />
                <button class="collect-input__clear" data-action="collect-clear-keyword" title="清空">${icon("close")}</button>
              </div>
              <button class="collect-board__button collect-board__button--ghost" data-action="collect-search">搜索</button>
              <button class="collect-board__button" data-action="collect-search">全局搜索</button>
            </div>
            <label class="collect-input collect-input--ticket">
              <span>受理号码</span>
              <input data-model="collectAcceptedNumber" value="${state.workspace.collectAcceptedNumber}" placeholder="请输入" />
            </label>
          </div>
          <div class="collect-board__content">
            <div class="collect-board__table">
              <div class="collect-table__head">
                <span>选择</span>
                <span>节点名称</span>
              </div>
              <div class="collect-table__body">
                ${visibleItems.map((item) => {
                  const checked = state.workspace.collectSelectedIds.includes(item.id);
                  return `
                    <div class="collect-table__row">
                      <button
                        class="collect-table__check ${checked ? "is-active" : ""}"
                        data-action="collect-toggle-item"
                        data-id="${item.id}"
                        title="选择"
                      >
                        ${checked ? icon("check") : ""}
                      </button>
                      <span class="collect-table__name">${item.path}</span>
                      <button class="collect-table__favorite" data-action="collect-favorite" title="收藏">★</button>
                    </div>
                  `;
                }).join("") || `<div class="collect-selected__empty collect-selected__empty--table">当前分类下暂无节点内容</div>`}
              </div>
            </div>
            <div class="collect-board__selected">
              <div class="collect-board__selected-head" data-serial="流水号${collectWorkspaceSerial}">
                <div class="collect-board__selected-meta" data-count="（${selectedItems.length}）">
                  <strong>已选列表</strong>
                  <span>（${selectedItems.length}）</span>
                </div>
                <em>流水号${collectWorkspaceSerial}</em>
              </div>
              <div class="collect-selected__list">
                ${selectedItems.length ? selectedItems.map((item) => `
                  <div class="collect-selected__item">
                    <button class="collect-selected__remove" data-action="collect-remove-item" data-id="${item.id}" title="移除">×</button>
                    <span>${item.path}</span>
                  </div>
                `).join("") : `<div class="collect-selected__empty">当前还没有选择节点内容</div>`}
              </div>
              <div class="collect-board__remark-head">
                <span>备注</span>
                <label class="collect-check">
                  <input type="checkbox" ${state.workspace.collectKeepRecording ? "checked" : ""} data-action="collect-toggle-keep" />
                  <span>录音永久保存</span>
                </label>
              </div>
              <textarea class="collect-board__remark" data-model="collectRemark" placeholder="请输入备注内容">${state.workspace.collectRemark}</textarea>
              <div class="collect-board__actions">
                <button class="collect-board__button collect-board__button--ghost" data-action="close-collect-page">取消</button>
                <button class="collect-board__button" data-action="collect-confirm-page">确定</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderHelpPage() {
  return `
    <section class="help-workspace">
      <div class="help-workspace__header">
        <h2>帮助</h2>
        <button class="help-workspace__close" data-action="close-help-page" title="关闭">${icon("close")}</button>
      </div>
      <section class="help-workspace__section">
        <h3>操作手册</h3>
        <div class="help-page__manuals">
          ${helpPageManuals.map((item) => `
            <article class="help-page__card help-page__card--manual">
              <div class="help-page__doc-icon">
                <span>PDF</span>
              </div>
              <div class="help-page__meta">
                <strong>${item.name}</strong>
                <span>${item.size}</span>
              </div>
              <button class="help-page__download" data-action="help-download">
                ${icon("download")}
                <span>${item.action}</span>
              </button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="help-workspace__section">
        <h3>浏览器</h3>
        <div class="help-page__browser-grid">
          ${helpPageBrowsers.map((item) => `
            <article class="help-page__card help-page__card--browser">
              <div class="help-page__browser-mark help-page__browser-mark--${item.key}">
                <span>${item.key === "360" ? "360" : item.name.slice(0, 1)}</span>
              </div>
              <div class="help-page__meta">
                <strong>${item.name}</strong>
                <span>${item.version}</span>
              </div>
              <button class="help-page__download" data-action="help-download">
                ${icon("download")}
                <span>${item.action}</span>
              </button>
            </article>
          `).join("")}
        </div>
      </section>
    </section>
  `;
}

function renderSettingsMenuButton(tab, iconName, label) {
  return `
    <button class="settings-workspace__menu-button ${state.workspace.settingsTab === tab ? "is-active" : ""}" data-action="settings-${tab}">
      <span>${icon(iconName)}</span>
      <strong>${label}</strong>
    </button>
  `;
}

function renderSettingsPreview(mode, label) {
  return `
    <button class="settings-display-card ${state.workspace.settingsWindowMode === mode ? "is-active" : ""}" data-action="settings-window-mode" data-value="${mode}">
      <span class="settings-display-card__radio"><i></i></span>
      <div class="settings-display-card__preview settings-display-card__preview--${mode}">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <strong>${label}</strong>
    </button>
  `;
}

function renderSettingsGeneralPage() {
  return `
    <section class="settings-page settings-page--general">
      <div class="settings-page__split">
        <div class="settings-general">
          <button class="settings-toggle ${state.workspace.settingsAutoStart ? "is-active" : ""}" data-action="settings-toggle-autostart">
            <span class="settings-toggle__box">${state.workspace.settingsAutoStart ? icon("check") : ""}</span>
            <strong>开机自动启用</strong>
          </button>
          <section class="settings-section">
            <h3>登录后显示尺寸</h3>
            <div class="settings-display-grid">
              ${renderSettingsPreview("windowed", "窗口化")}
              ${renderSettingsPreview("maximized", "最大化")}
              ${renderSettingsPreview("floating", "浮窗化")}
            </div>
          </section>
          <section class="settings-section">
            <h3>快捷键</h3>
            <div class="settings-shortcuts">
              ${settingsPageShortcuts.map((item) => `
                <button class="settings-toggle ${state.workspace.settingsShortcutSelection.includes(item.id) ? "is-active" : ""}" data-action="settings-toggle-shortcut" data-value="${item.id}">
                  <span class="settings-toggle__box">${state.workspace.settingsShortcutSelection.includes(item.id) ? icon("check") : ""}</span>
                  <strong>${item.label}</strong>
                  <em>(${item.value})</em>
                </button>
              `).join("")}
            </div>
          </section>
          <section class="settings-section">
            <h3>缓存文件</h3>
            <div class="settings-storage-card">
              <div class="settings-storage-line">
                <span>日志文件保存至</span>
                <div class="settings-storage-field">
                  <label class="settings-input settings-input--icon">
                    <i>${icon("folder")}</i>
                    <input data-model="settingsLogFolder" value="${state.workspace.settingsLogFolder}" />
                  </label>
                  <button class="settings-page__button settings-page__button--ghost" data-action="settings-open-log">打开</button>
                  <button class="settings-page__button settings-page__button--ghost" data-action="settings-change-log">更改</button>
                </div>
              </div>
              <p class="settings-storage-note">当出现异常时，需要点击“打开”提供日志文件至运营人员。</p>
              <div class="settings-storage-line">
                <span>日志文件清理于</span>
                <label class="settings-input settings-input--compact">
                  <input data-model="settingsLogCleanup" value="${state.workspace.settingsLogCleanup}" />
                </label>
              </div>
            </div>
          </section>
          <div class="settings-page__actions settings-page__actions--left">
            <button class="settings-page__button settings-page__button--ghost" data-action="settings-cancel-page">取消</button>
            <button class="settings-page__button" data-action="settings-save-page">确定</button>
          </div>
        </div>
        <aside class="settings-version">
          <h3>版本信息</h3>
          <strong>呼叫中心应用平台</strong>
          <span>V1.2.3</span>
          <button class="settings-page__button" data-action="settings-check-update">检查更新</button>
        </aside>
      </div>
    </section>
  `;
}

function renderSettingsDataPage() {
  return `
    <section class="settings-page settings-page--data">
      <div class="settings-data">
        <div class="settings-data__preview">
          <div class="settings-data__mock">
            <div class="settings-data__mock-top"></div>
            <div class="settings-data__mock-shell">
              <div class="settings-data__mock-side"></div>
              <div class="settings-data__mock-body">
                <div class="settings-data__mock-card settings-data__mock-card--profile"></div>
                <div class="settings-data__mock-metrics">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div class="settings-data__mock-panel"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="settings-data__metrics">
          <h3>我的工作台指标展示（最多8个）</h3>
          <div class="settings-metric-grid">
            ${settingsPageMetricOptions.map((item) => `
              <button class="settings-metric-chip ${state.workspace.settingsMetricSelection.includes(item.id) ? "is-active" : ""}" data-action="settings-toggle-metric" data-value="${item.id}">
                <span class="settings-metric-chip__box">${state.workspace.settingsMetricSelection.includes(item.id) ? icon("check") : ""}</span>
                <strong>${item.label}</strong>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="settings-page__actions settings-page__actions--center">
        <button class="settings-page__button settings-page__button--ghost" data-action="settings-cancel-page">取消</button>
        <button class="settings-page__button" data-action="settings-save-page">确定</button>
      </div>
    </section>
  `;
}

function renderSettingsPasswordPage() {
  return `
    <section class="settings-page settings-page--password">
      <div class="settings-password">
        <div class="settings-password__form">
          <h3>密码修改</h3>
          <label>
            <span><b>*</b>旧密码</span>
            <input type="password" data-model="settingsOldPassword" value="${state.workspace.settingsOldPassword}" />
          </label>
          <label>
            <span><b>*</b>新密码</span>
            <input type="password" data-model="settingsNewPassword" value="${state.workspace.settingsNewPassword}" />
          </label>
          <label>
            <span><b>*</b>请再次输入新密码</span>
            <input type="password" data-model="settingsConfirmPassword" value="${state.workspace.settingsConfirmPassword}" />
          </label>
          <div class="settings-page__actions settings-page__actions--left">
            <button class="settings-page__button settings-page__button--ghost" data-action="settings-cancel-page">取消</button>
            <button class="settings-page__button" data-action="settings-save-page">确定</button>
          </div>
        </div>
        <aside class="settings-password__rules">
          ${settingsPagePasswordRules.map((item) => `<p><span></span>${item}</p>`).join("")}
        </aside>
      </div>
    </section>
  `;
}

function renderSettingsPage() {
  const content = state.workspace.settingsTab === "data"
    ? renderSettingsDataPage()
    : state.workspace.settingsTab === "password"
      ? renderSettingsPasswordPage()
      : renderSettingsGeneralPage();
  return `
    <section class="settings-workspace">
      <aside class="settings-workspace__menu">
        ${renderSettingsMenuButton("general", "gear", "常规设置")}
        ${renderSettingsMenuButton("data", "database", "数据设置")}
        ${renderSettingsMenuButton("password", "lock", "密码修改")}
      </aside>
      <div class="settings-workspace__content">
        ${content}
      </div>
    </section>
  `;
}

function renderTransferCheckbox(checked, action, id = "", extra = "") {
  const className = ["transfer-check", checked ? "is-checked" : "", extra].filter(Boolean).join(" ");
  return `
    <button class="${className}" data-action="${action}" ${id ? `data-id="${id}"` : ""}>
      ${checked ? icon("check") : ""}
    </button>
  `;
}

function renderTransferField(label, model, options = {}) {
  const { placeholder = "请输入", select = false, wide = false } = options;
  return `
    <label class="transfer-field ${select ? "is-select" : ""} ${wide ? "is-wide" : ""}">
      <span>${label}</span>
      <div class="transfer-field__control">
        <input data-model="${model}" value="${state.workspace[model] || ""}" placeholder="${placeholder}" />
        ${select ? `<i>${icon("chevron-down")}</i>` : ""}
      </div>
    </label>
  `;
}

function renderTransferActionButton(label, action, tone = "default", options = {}) {
  const { disabled = false, value = "" } = options;
  return `
    <button
      class="transfer-action-button ${tone !== "default" ? `transfer-action-button--${tone}` : ""} ${disabled ? "is-disabled" : ""}"
      data-action="${action}"
      data-label="${label}"
      ${value ? `data-value="${value}"` : ""}
      ${disabled ? "disabled" : ""}
    >${label}</button>
  `;
}

function transferVisibleSeatRows() {
  return transferSeatPageRows.filter((item) => {
    if (state.workspace.transferSeatOnlyIdle && item.status !== "空闲") return false;
    if (state.workspace.transferSeatPerson && !`${item.name}${item.code}`.includes(state.workspace.transferSeatPerson)) return false;
    return true;
  });
}

function transferVisibleExternalRows() {
  return transferExternalPageRows.filter((item) => {
    if (state.workspace.transferExternalDescription && !item.note.includes(state.workspace.transferExternalDescription)) return false;
    return true;
  });
}

function transferSeatPageState() {
  const rows = transferVisibleSeatRows();
  const totalPages = Math.max(1, Math.ceil(rows.length / TRANSFER_SKILL_PAGE_SIZE));
  const currentPage = Math.min(Math.max(state.workspace.transferSeatPage, 1), totalPages);
  const start = (currentPage - 1) * TRANSFER_SKILL_PAGE_SIZE;
  return {
    rows,
    currentPage,
    totalPages,
    pagedRows: rows.slice(start, start + TRANSFER_SKILL_PAGE_SIZE),
  };
}

function transferExternalPageState() {
  const rows = transferVisibleExternalRows();
  const totalPages = Math.max(1, Math.ceil(rows.length / TRANSFER_SKILL_PAGE_SIZE));
  const currentPage = Math.min(Math.max(state.workspace.transferExternalPage, 1), totalPages);
  const start = (currentPage - 1) * TRANSFER_SKILL_PAGE_SIZE;
  return {
    rows,
    currentPage,
    totalPages,
    pagedRows: rows.slice(start, start + TRANSFER_SKILL_PAGE_SIZE),
  };
}

function findTransferSkillNodeByKey(nodes, key) {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const match = findTransferSkillNodeByKey(node.children, key);
      if (match) return match;
    }
  }
  return null;
}

function flattenTransferSkillKeys(node) {
  if (!node.children?.length) return [node.key];
  return [node.key, ...node.children.flatMap((child) => flattenTransferSkillKeys(child))];
}

function transferVisibleSkillRows() {
  const selectedKey = state.workspace.transferSkillTreeSelection;
  const activeNode = findTransferSkillNodeByKey(transferSkillTree12345, selectedKey);
  const visibleKeys = activeNode ? new Set(flattenTransferSkillKeys(activeNode)) : null;
  return transferSkillPageRows12345.filter((item) => {
    if (visibleKeys && !visibleKeys.has(item.groupKey)) return false;
    if (state.workspace.transferSkillName && !item.name.includes(state.workspace.transferSkillName)) return false;
    if (state.workspace.transferSkillCode && !item.code.includes(state.workspace.transferSkillCode)) return false;
    return true;
  });
}

function transferSkillPageState() {
  const rows = transferVisibleSkillRows();
  const totalPages = Math.max(1, Math.ceil(rows.length / TRANSFER_SKILL_PAGE_SIZE));
  const currentPage = Math.min(Math.max(state.workspace.transferSkillPage, 1), totalPages);
  const start = (currentPage - 1) * TRANSFER_SKILL_PAGE_SIZE;
  return {
    rows,
    currentPage,
    totalPages,
    pagedRows: rows.slice(start, start + TRANSFER_SKILL_PAGE_SIZE),
  };
}

function renderTransferSkillTreeNodes(nodes, level = 0) {
  return nodes.map((node) => {
    const hasChildren = Boolean(node.children?.length);
    const expanded = state.workspace.transferSkillExpandedKeys.includes(node.key);
    const active = state.workspace.transferSkillTreeSelection === node.key;
    return `
      <div class="transfer-tree__node">
        <div class="transfer-tree__row ${active ? "is-active" : ""}" style="--transfer-indent:${level}">
          ${hasChildren
            ? `<button class="transfer-tree__toggle ${expanded ? "is-open" : ""}" data-action="transfer-toggle-tree" data-value="${node.key}">${icon("chevron-down")}</button>`
            : `<span class="transfer-tree__toggle transfer-tree__toggle--empty"></span>`}
          <button class="transfer-tree__label" data-action="transfer-select-tree" data-value="${node.key}">${node.label}</button>
        </div>
        ${hasChildren && expanded ? `<div class="transfer-tree__children">${renderTransferSkillTreeNodes(node.children, level + 1)}</div>` : ""}
      </div>
    `;
  }).join("");
}

function renderTransferSeatPage() {
  const { pagedRows, currentPage, totalPages } = transferSeatPageState();
  const assistStage = state.workspace.transferDemoStage;
  const assistWaiting = assistStage === "waiting-answer";
  const assistHelping = assistStage === "helping";
  const assistThreeWay = assistStage === "three-way";
  const assistActive = assistHelping || assistThreeWay;
  const isSuspendWaiting = assistStage === "suspend-waiting";
  return `
    <section class="transfer-page">
      <div class="transfer-page__filters transfer-page__filters--seat">
        ${renderTransferField("适用范围", "transferSeatScope", { select: true })}
        ${renderTransferField("技能组", "transferSeatSkillGroup", { select: true })}
        ${renderTransferField("话务角色", "transferSeatRole", { select: true })}
        ${renderTransferField("权限角色", "transferSeatPermission", { select: true })}
        ${renderTransferField("班组", "transferSeatTeam", { select: true })}
        ${renderTransferField("姓名/工号", "transferSeatPerson")}
        <label class="transfer-inline-check">
          ${renderTransferCheckbox(state.workspace.transferSeatOnlyIdle, "transfer-toggle-seat-idle", "", "transfer-check--inline")}
          <span>仅展示空闲坐席</span>
        </label>
        <div class="transfer-page__filter-actions">
          ${renderTransferActionButton("重置", "transfer-reset", "ghost")}
          ${renderTransferActionButton("查询", "transfer-query", "primary")}
        </div>
      </div>
      <div class="transfer-table-wrap">
        <table class="transfer-table">
          <thead>
            <tr>
              <th>工号</th>
              <th>选择</th>
              <th>姓名</th>
              <th>状态</th>
              <th>角色</th>
              <th>技能</th>
            </tr>
          </thead>
          <tbody>
            ${pagedRows.map((item) => `
              <tr>
                <td>${item.code}</td>
                <td>${renderTransferCheckbox(state.workspace.transferSeatSelectedIds.includes(item.id), "transfer-toggle-seat", item.id)}</td>
                <td>${item.name}</td>
                <td><span class="transfer-status ${item.status === "空闲" ? "is-idle" : "is-busy"}">${item.status}</span></td>
                <td>${item.role}</td>
                <td>${item.skill}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="transfer-pagination">
        <button class="transfer-pagination__button" data-action="transfer-seat-page" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
        <div class="transfer-pagination__pages">
          ${Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => `
            <button class="transfer-pagination__page ${page === currentPage ? "is-active" : ""}" data-action="transfer-seat-page" data-page="${page}">${page}</button>
          `).join("")}
        </div>
        <button class="transfer-pagination__button" data-action="transfer-seat-page" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
      </div>
      <div class="transfer-extra">
        <div class="transfer-extra__title">附加信息</div>
        <textarea class="transfer-extra__box" data-model="transferSeatExtraInfo" placeholder="请输入附加信息">${state.workspace.transferSeatExtraInfo}</textarea>
      </div>
      <div class="transfer-seat-actions">
        <label class="transfer-inline-check transfer-inline-check--primary">
          ${renderTransferCheckbox(state.workspace.transferSeatDirect, "transfer-toggle-seat-direct", "", "transfer-check--inline")}
          <span>直接转接</span>
        </label>
        <div class="transfer-page__footer-actions">
          ${isSuspendWaiting
            ? `${renderTransferActionButton("取消转接", "transfer-cancel-suspend", "warning")}`
            : `
              ${assistWaiting || assistActive
                ? `
                  ${renderTransferActionButton("三方通话", "transfer-three-way", assistActive ? "primary" : "muted", { disabled: assistWaiting || assistThreeWay })}
                  ${renderTransferActionButton("确认互助", "transfer-confirm-assist", assistActive ? "primary" : "muted", { disabled: assistWaiting ? true : false })}
                  ${renderTransferActionButton("取消互助", "transfer-cancel-assist", assistThreeWay ? "warning" : "muted", { disabled: false })}
                `
                : `
                  ${renderTransferActionButton("互助", "transfer-start-assist", "primary")}
                  ${renderTransferActionButton("挂起转", "transfer-suspend", "muted")}
                  ${renderTransferActionButton("释放转", "transfer-release", "warning")}
                `}
            `}
        </div>
      </div>
    </section>
  `;
}

function renderTransferExternalPage() {
  const { pagedRows, currentPage, totalPages } = transferExternalPageState();
  return `
    <section class="transfer-page">
      <div class="transfer-page__filters transfer-page__filters--external">
        ${renderTransferField("适用范围", "transferExternalScope", { select: true })}
        ${renderTransferField("说明", "transferExternalDescription")}
        <div class="transfer-page__filter-actions">
          ${renderTransferActionButton("重置", "transfer-reset", "ghost")}
          ${renderTransferActionButton("查询", "transfer-query", "primary")}
        </div>
      </div>
      <div class="transfer-table-wrap">
        <table class="transfer-table">
          <thead>
            <tr>
              <th>号码</th>
              <th>选择</th>
              <th>转接类型</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            ${pagedRows.map((item) => `
              <tr>
                <td>${item.number}</td>
                <td>${renderTransferCheckbox(state.workspace.transferExternalSelectedIds.includes(item.id), "transfer-toggle-external", item.id)}</td>
                <td>${item.type}</td>
                <td class="is-long">${item.note}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="transfer-pagination">
        <button class="transfer-pagination__button" data-action="transfer-external-page" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
        <div class="transfer-pagination__pages">
          ${Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => `
            <button class="transfer-pagination__page ${page === currentPage ? "is-active" : ""}" data-action="transfer-external-page" data-page="${page}">${page}</button>
          `).join("")}
        </div>
        <button class="transfer-pagination__button" data-action="transfer-external-page" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
      </div>
      <div class="transfer-extra transfer-extra--external">
        <label class="transfer-field transfer-field--compact">
          <span>外线号码</span>
          <div class="transfer-field__control">
            <input data-model="transferExternalNumber" value="${state.workspace.transferExternalNumber}" placeholder="请输入" />
          </div>
        </label>
        <div class="transfer-page__footer-actions">
          ${renderTransferActionButton("转接", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("互助", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("切换", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("确认互助", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("取消互助", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("呼出", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("挂机", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("退出", "transfer-exit", "warning")}
        </div>
      </div>
    </section>
  `;
}

function renderTransferSkillPage() {
  const rows = transferVisibleSkillRows();
  const selected = rows.find((item) => item.id === state.workspace.transferSkillSelectedId)
    || transferSkillPageRows12345.find((item) => item.id === state.workspace.transferSkillSelectedId)
    || rows[0];
  return `
    <section class="transfer-page">
      <div class="transfer-page__filters transfer-page__filters--skill">
        ${renderTransferField("技能队列名称", "transferSkillName")}
        ${renderTransferField("技能队列编码", "transferSkillCode")}
        <div class="transfer-page__filter-actions">
          ${renderTransferActionButton("重置", "transfer-reset", "ghost")}
          ${renderTransferActionButton("查询", "transfer-query", "primary")}
        </div>
      </div>
      <div class="transfer-skill-layout">
        <aside class="transfer-tree">
          ${renderTransferSkillTreeNodes(transferSkillTree12345)}
        </aside>
        <div class="transfer-table-wrap transfer-table-wrap--skill">
          <table class="transfer-table">
            <thead>
              <tr>
                <th>选择</th>
                <th>技能队列编码</th>
                <th>技能队列名称</th>
                <th>是否互助转</th>
                <th>签入数</th>
                <th>等待数</th>
                <th>空闲数</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((item) => `
                <tr>
                  <td>${renderTransferCheckbox(state.workspace.transferSkillSelectedId === item.id, "transfer-toggle-skill", item.id)}</td>
                  <td>${item.code}</td>
                  <td>${item.name}</td>
                  <td>${item.mutual}</td>
                  <td>${item.signInCount}</td>
                  <td>${item.waitCount}</td>
                  <td>${item.idleCount}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="transfer-extra">
        <div class="transfer-extra__title">附加信息</div>
        <textarea class="transfer-extra__box" data-model="transferSkillExtraInfo" placeholder="请输入附加信息">${state.workspace.transferSkillExtraInfo}</textarea>
      </div>
      <div class="transfer-skill-footer">
        <div class="transfer-skill-footer__summary">
          <strong>已选择</strong>
          ${selected ? `<span>${selected.name}：签入${selected.signInCount}｜等待${selected.waitCount}｜空闲${selected.idleCount}</span>` : `<span>未选择技能队列</span>`}
        </div>
        <div class="transfer-page__footer-actions">
          ${renderTransferActionButton("互助", "transfer-footer-action", "primary")}
          ${renderTransferActionButton("确认互助", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("取消互助", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("挂起转", "transfer-footer-action", "muted")}
          ${renderTransferActionButton("退出", "transfer-exit", "warning")}
        </div>
      </div>
    </section>
  `;
}

function renderTransferPage() {
  const content = state.workspace.transferTab === "external"
    ? renderTransferExternalPageV2()
    : state.workspace.transferTab === "skill"
      ? renderTransferSkillPageV2()
      : renderTransferSeatPage();
  return `
    <section class="transfer-workspace">
      <div class="transfer-workspace__head">
        <div class="transfer-workspace__tabs">
          <button class="${state.workspace.transferTab === "seat" ? "is-active" : ""}" data-action="transfer-seat">转坐席</button>
          <button class="${state.workspace.transferTab === "external" ? "is-active" : ""}" data-action="transfer-external">转外线</button>
          <button class="${state.workspace.transferTab === "skill" ? "is-active" : ""}" data-action="transfer-skill">转技能组</button>
        </div>
        <button class="transfer-workspace__close" data-action="close-transfer-page" title="关闭">${icon("close")}</button>
      </div>
      <div class="transfer-workspace__body">
        ${content}
      </div>
    </section>
  `;
}

function renderTransferExternalPageV2() {
  const { pagedRows, currentPage, totalPages } = transferExternalPageState();
  const isSuspendWaiting = state.workspace.transferDemoStage === "suspend-waiting";
  return `
    <section class="transfer-page">
      <div class="transfer-page__filters transfer-page__filters--external">
        ${renderTransferField("适用范围", "transferExternalScope", { select: true })}
        ${renderTransferField("说明", "transferExternalDescription")}
        <div class="transfer-page__filter-actions">
          ${renderTransferActionButton("重置", "transfer-reset", "ghost")}
          ${renderTransferActionButton("查询", "transfer-query", "primary")}
        </div>
      </div>
      <div class="transfer-table-wrap">
        <table class="transfer-table">
          <thead>
            <tr>
              <th>号码</th>
              <th>选择</th>
              <th>转接类型</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            ${pagedRows.map((item) => `
              <tr>
                <td>${item.number}</td>
                <td>${renderTransferCheckbox(state.workspace.transferExternalSelectedIds.includes(item.id), "transfer-toggle-external", item.id)}</td>
                <td>${item.type}</td>
                <td class="is-long">${item.note}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="transfer-pagination">
        <button class="transfer-pagination__button" data-action="transfer-external-page" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
        <div class="transfer-pagination__pages">
          ${Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => `
            <button class="transfer-pagination__page ${page === currentPage ? "is-active" : ""}" data-action="transfer-external-page" data-page="${page}">${page}</button>
          `).join("")}
        </div>
        <button class="transfer-pagination__button" data-action="transfer-external-page" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
      </div>
      <div class="transfer-extra transfer-extra--external">
        <label class="transfer-field transfer-field--compact">
          <span>外线号码</span>
          <div class="transfer-field__control">
            <input data-model="transferExternalNumber" value="${state.workspace.transferExternalNumber}" placeholder="请输入" />
          </div>
        </label>
        <div class="transfer-page__footer-actions">
          ${isSuspendWaiting
            ? `${renderTransferActionButton("取消转接", "transfer-cancel-suspend", "warning")}`
            : `
              ${renderTransferActionButton("挂起转", "transfer-suspend", "muted")}
              ${renderTransferActionButton("释放转", "transfer-release", "warning")}
            `}
        </div>
      </div>
    </section>
  `;
}

function renderTransferSkillPageV2() {
  const { rows, pagedRows, currentPage, totalPages } = transferSkillPageState();
  const selected = rows.find((item) => item.id === state.workspace.transferSkillSelectedId)
    || transferSkillPageRows12345.find((item) => item.id === state.workspace.transferSkillSelectedId)
    || rows[0];
  const isSuspendWaiting = state.workspace.transferDemoStage === "suspend-waiting";
  return `
    <section class="transfer-page">
      <div class="transfer-page__filters transfer-page__filters--skill">
        ${renderTransferField("技能队列名称", "transferSkillName")}
        ${renderTransferField("技能队列编码", "transferSkillCode")}
        <div class="transfer-page__filter-actions">
          ${renderTransferActionButton("重置", "transfer-reset", "ghost")}
          ${renderTransferActionButton("查询", "transfer-query", "primary")}
        </div>
      </div>
      <div class="transfer-skill-layout transfer-skill-layout--fixed">
        <aside class="transfer-tree">
          <div class="transfer-tree__scroll">
            ${renderTransferSkillTreeNodes(transferSkillTree12345)}
          </div>
        </aside>
        <div class="transfer-skill-panel">
          <div class="transfer-table-wrap transfer-table-wrap--skill">
            <table class="transfer-table">
              <thead>
                <tr>
                  <th>选择</th>
                  <th>技能队列编码</th>
                  <th>技能队列名称</th>
                  <th>是否互助转</th>
                  <th>签入数</th>
                  <th>等待数</th>
                  <th>空闲数</th>
                </tr>
              </thead>
              <tbody>
                ${pagedRows.map((item) => `
                  <tr>
                    <td>${renderTransferCheckbox(state.workspace.transferSkillSelectedId === item.id, "transfer-toggle-skill", item.id)}</td>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.mutual}</td>
                    <td>${item.signInCount}</td>
                    <td>${item.waitCount}</td>
                    <td>${item.idleCount}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          <div class="transfer-pagination">
            <button class="transfer-pagination__button" data-action="transfer-skill-page" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
            <div class="transfer-pagination__pages">
              ${Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => `
                <button class="transfer-pagination__page ${page === currentPage ? "is-active" : ""}" data-action="transfer-skill-page" data-page="${page}">${page}</button>
              `).join("")}
            </div>
            <button class="transfer-pagination__button" data-action="transfer-skill-page" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
          </div>
        </div>
      </div>
      <div class="transfer-extra">
        <div class="transfer-extra__title">附加信息</div>
        <textarea class="transfer-extra__box" data-model="transferSkillExtraInfo" placeholder="请输入附加信息">${state.workspace.transferSkillExtraInfo}</textarea>
      </div>
      <div class="transfer-skill-footer">
        <div class="transfer-skill-footer__summary">
          <strong>已选择</strong>
          ${selected ? `
            <span>
              ${selected.name}：
              <b>签入${selected.signInCount}</b>
              <b>等待${selected.waitCount}</b>
              <b>空闲${selected.idleCount}</b>
            </span>
          ` : `<span>未选择技能队列</span>`}
        </div>
        <div class="transfer-page__footer-actions">
          ${isSuspendWaiting
            ? `${renderTransferActionButton("取消转接", "transfer-cancel-suspend", "warning")}`
            : `
              ${renderTransferActionButton("挂起转", "transfer-suspend", "muted")}
              ${renderTransferActionButton("释放转", "transfer-release", "warning")}
            `}
        </div>
      </div>
    </section>
  `;
}

function renderIncomingDemoWidget() {
  const telephony = state.workspace.telephony;
  const active = state.workspace.incomingDemoActive && (telephony.status === "incoming" || telephony.status === "talking" || telephony.status === "outbound");
  if (state.workspace.incomingDemoMinimized) {
    return `
      <button class="demo-widget__dock" data-action="toggle-incoming-demo-minimize" title="呼入演示">
        <span>${icon("phone-in")}</span>
      </button>
    `;
  }
  return `
    <section class="demo-widget demo-widget--incoming">
      <div class="demo-widget__header">
        <div>
          <strong>呼入演示</strong>
          <span>${active ? "当前已接入演示通话" : "输入号码后可直接接入通话"}</span>
        </div>
        <button class="demo-widget__minimize" data-action="toggle-incoming-demo-minimize" title="最小化">${icon("chevron-down")}</button>
      </div>
      <label class="demo-widget__field">
        <span>号码</span>
        <input data-model="incomingDemoNumber" value="${state.workspace.incomingDemoNumber}" placeholder="请输入演示号码" />
      </label>
      <div class="demo-widget__actions">
        ${active
          ? `<button class="demo-widget__button demo-widget__button--danger" data-action="incoming-demo-hangup">挂机</button>`
          : `<button class="demo-widget__button demo-widget__button--primary" data-action="incoming-demo-start">呼入</button>`}
      </div>
    </section>
  `;
}

function renderTransferDemoWidget() {
  const stage = state.workspace.transferDemoStage;
  const isAssist = stage === "waiting-answer" || stage === "helping" || stage === "three-way";
  const isSuspend = stage === "suspend-waiting";
  const active = isAssist || isSuspend;
  if (state.workspace.transferDemoMinimized) {
    return `
      <button class="demo-widget__dock demo-widget__dock--transfer" data-action="toggle-transfer-demo-minimize" title="转接演示">
        ${toolIcon("transfer")}
      </button>
    `;
  }
  return `
    <section class="demo-widget demo-widget--transfer">
      <div class="demo-widget__header">
        <div>
          <strong>转接演示</strong>
          <span>${active ? (isSuspend ? "用于演示挂起转接话" : "用于演示互助接话与确认互助") : "等待转接"}</span>
        </div>
        <button class="demo-widget__minimize" data-action="toggle-transfer-demo-minimize" title="最小化">${icon("chevron-down")}</button>
      </div>
      ${active ? `
        <div class="demo-widget__transfer-meta">
          <div><span>姓名</span><strong>${state.workspace.transferDemoSeatName}</strong></div>
          <div><span>工号</span><strong>${state.workspace.transferDemoSeatCode}</strong></div>
          <div class="is-wide"><span>备注</span><em>${state.workspace.transferDemoRemark || "未填写备注"}</em></div>
        </div>
        <div class="demo-widget__actions">
          ${stage === "waiting-answer"
            ? `<button class="demo-widget__button demo-widget__button--primary" data-action="transfer-demo-answer">接话</button>`
            : stage === "suspend-waiting"
              ? `<button class="demo-widget__button demo-widget__button--primary" data-action="transfer-suspend-answer">接话</button>`
              : ""}
          <button class="demo-widget__button demo-widget__button--danger" data-action="transfer-demo-hangup">挂机</button>
        </div>
      ` : `
        <div class="demo-widget__empty">等待转接</div>
      `}
    </section>
  `;
}

function renderWorkRecordPlayerWave(rowId) {
  const seed = (rowId || "record").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: 36 }, (_, index) => {
    const height = 8 + ((seed + index * 11) % 18);
    return `<span style="height:${height}px"></span>`;
  }).join("");
}

function renderWorkRecordPlayerWidget() {
  const row = activeWorkRecordPlayerRow();
  if (!state.workspace.workRecordPlayerOpen || !row) return "";
  const playerStatus = state.workspace.workRecordPlayerStatus || "stopped";
  if (state.workspace.workRecordPlayerMinimized) {
    return `
      <button class="demo-widget__dock demo-widget__dock--audio" data-action="toggle-work-record-player-minimize" title="录音播放器">
        <span>${icon("play")}</span>
      </button>
    `;
  }
  return `
    <section class="demo-widget demo-widget--audio-player">
      <div class="demo-widget__header">
        <div>
          <strong>录音播放器</strong>
          <span>${row.callTime} · ${row.direction} · ${row.caller} / ${row.callee}</span>
        </div>
        <div class="demo-widget__header-actions">
          <button class="demo-widget__minimize" data-action="toggle-work-record-player-minimize" title="最小化">${icon("chevron-down")}</button>
          <button class="demo-widget__minimize" data-action="close-work-record-player" title="关闭">${icon("close")}</button>
        </div>
      </div>
      <div class="audio-player__track-shell">
        <div class="audio-player__track" aria-hidden="true">
          <div class="audio-player__track-progress" data-work-record-player-progress style="width:${workRecordPlayerProgress()}%"></div>
          ${renderWorkRecordPlayerWave(row.id)}
        </div>
        <div class="audio-player__time">
          <strong data-work-record-player-current>${formatPlayerTime(state.workspace.workRecordPlayerCurrentTime)}</strong>
          <span data-work-record-player-duration>${formatPlayerTime(state.workspace.workRecordPlayerDuration)}</span>
        </div>
      </div>
      <div class="audio-player__controls">
        <button class="audio-player__control ${playerStatus === "stopped" ? "is-active" : ""}" data-action="work-record-player-stop" title="停止">
          <span>${icon("stop")}</span>
          <strong>停止</strong>
        </button>
        <button class="audio-player__control ${playerStatus === "paused" ? "is-active" : ""}" data-action="work-record-player-pause" title="暂停">
          <span>${icon("pause")}</span>
          <strong>暂停</strong>
        </button>
        <button class="audio-player__control ${playerStatus === "playing" ? "is-active" : ""}" data-action="work-record-player-play" title="播放">
          <span>${icon("play")}</span>
          <strong>播放</strong>
        </button>
        <button class="audio-player__control" data-action="work-record-player-forward" title="快进15秒">
          <span>${icon("forward")}</span>
          <strong>快进15秒</strong>
        </button>
      </div>
      <div class="audio-player__rates">
        ${[1, 1.25, 1.5, 2].map((rate) => `
          <button
            class="audio-player__rate ${state.workspace.workRecordPlayerRate === rate ? "is-active" : ""}"
            data-action="work-record-player-rate"
            data-value="${rate}"
          >${rate}x</button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderDemoWidgets() {
  return `
    <div class="demo-widget-stack">
      ${renderWorkRecordPlayerWidget()}
      ${renderIncomingDemoWidget()}
      ${renderTransferDemoWidget()}
    </div>
  `;
}

function renderTransferModal() {
  const tab = state.workspace.transferTab;
  const body = tab === "skill"
    ? `
      <div class="panel-toolbar">
        <label class="toolbar-field"><span>适用范围</span><input value="全部" /></label>
        <label class="toolbar-field"><span>技能组名称</span><input placeholder="请输入" /></label>
        <button class="table-link">查询</button>
        <button class="table-link table-link--ghost">重置</button>
      </div>
      ${renderTable(transferSkillHeaders, transferSkillRows, "table-wrap--modal", 4)}
    `
    : tab === "external"
      ? `
        <div class="panel-toolbar">
          <label class="toolbar-field"><span>适用范围</span><input value="全部" /></label>
          <label class="toolbar-field"><span>技能组</span><input placeholder="请输入" /></label>
          <label class="toolbar-field"><span>话务角色</span><input placeholder="请输入" /></label>
          <label class="toolbar-field"><span>权限角色</span><input placeholder="请输入" /></label>
          <label class="toolbar-field"><span>班组</span><input placeholder="请输入" /></label>
          <button class="table-link">查询</button>
          <button class="table-link table-link--ghost">重置</button>
        </div>
        ${renderTable(transferExternalHeaders, transferExternalRows, "table-wrap--modal quality-table--compact", 5)}
      `
      : `
        <div class="panel-toolbar">
          <label class="toolbar-field"><span>适用范围</span><input value="全部" /></label>
          <label class="toolbar-field"><span>技能组</span><input placeholder="请输入" /></label>
          <label class="toolbar-field"><span>话务角色</span><input placeholder="请输入" /></label>
          <label class="toolbar-field"><span>权限角色</span><input placeholder="请输入" /></label>
          <label class="toolbar-field"><span>班组</span><input placeholder="请输入" /></label>
          <button class="table-link">查询</button>
          <button class="table-link table-link--ghost">重置</button>
        </div>
        ${renderTable(transferSeatHeaders, transferSeatRows, "table-wrap--modal", 4)}
      `;

  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-panel modal-panel--wide" data-modal-panel="true">
        <div class="modal-panel__header">
          <div>
            <h3>转接</h3>
            <p>转坐席、转外线和转技能组界面。</p>
          </div>
          <button class="modal-panel__close" data-action="close-modal">${icon("close")}</button>
        </div>
        <div class="modal-tabs">
          <button class="${tab === "seat" ? "is-active" : ""}" data-action="transfer-seat">转坐席</button>
          <button class="${tab === "external" ? "is-active" : ""}" data-action="transfer-external">转外线</button>
          <button class="${tab === "skill" ? "is-active" : ""}" data-action="transfer-skill">转技能组</button>
        </div>
        <section class="modal-panel__section">
          <div class="panel-summary">
            <div class="panel-summary__item"><span>当前通话</span><strong>${state.workspace.telephony.callNumber}</strong></div>
            <div class="panel-summary__item"><span>所属班组</span><strong>某某班组</strong></div>
            <div class="panel-summary__item"><span>当前技能组</span><strong>福建福州 0591</strong></div>
          </div>
          ${body}
        </section>
      </div>
    </div>
  `;
}

function renderCollectModal() {
  const tab = state.workspace.collectTab;
  const rows = tab === "current" ? collectCurrentRows : collectHistoryRows;
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-panel modal-panel--wide" data-modal-panel="true">
        <div class="modal-panel__header">
          <div>
            <h3>采集</h3>
            <p>按原稿分类重新生成的采集界面，支持本通电话和历史未采集切换。</p>
          </div>
          <button class="modal-panel__close" data-action="close-modal">${icon("close")}</button>
        </div>
        <div class="modal-tabs">
          <button class="${tab === "current" ? "is-active" : ""}" data-action="collect-current">本通电话</button>
          <button class="${tab === "history" ? "is-active" : ""}" data-action="collect-history">历史未采集</button>
        </div>
        <section class="modal-panel__section">
          <div class="scene-switches">
            <button class="${state.workspace.collectScene === "policy" ? "is-active" : ""}" data-action="collect-scene-policy">政企查询</button>
            <button class="${state.workspace.collectScene === "info" ? "is-active" : ""}" data-action="collect-scene-info">信息查询</button>
            <button class="${state.workspace.collectScene === "query" ? "is-active" : ""}" data-action="collect-scene-query">查询业务</button>
          </div>
          <div class="category-chips">
            ${collectCategories.map((item) => `<button class="${state.workspace.collectCategory === item ? "is-active" : ""}" data-action="collect-category" data-value="${item}">${item}</button>`).join("")}
          </div>
          <div class="panel-toolbar panel-toolbar--collect">
            <label class="toolbar-field"><span>知识项</span><input placeholder="请输入关键词" /></label>
            <label class="toolbar-field"><span>备注</span><input placeholder="请输入" /></label>
            <button class="table-link">查询</button>
            <button class="table-link table-link--ghost">重置</button>
          </div>
          ${renderTable(collectHeaders, rows, "table-wrap--modal")}
        </section>
      </div>
    </div>
  `;
}

function renderHelpModal() {
  const manual = state.workspace.helpSection === "manual";
  const browser = state.workspace.helpSection === "browser";
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-panel modal-panel--wide" data-modal-panel="true">
        <div class="modal-panel__header">
          <div>
            <h3>帮助</h3>
            <p>保留原稿中的操作手册和浏览器分组，只做样式整理，不改内容结构。</p>
          </div>
          <button class="modal-panel__close" data-action="close-modal">${icon("close")}</button>
        </div>
        <div class="modal-panel__body modal-panel__body--help">
          <aside class="modal-menu modal-menu--static">
            <div class="modal-menu__title">帮助</div>
            <button class="${manual ? "is-active" : ""}" data-action="help-manual">操作手册</button>
            <button class="${browser ? "is-active" : ""}" data-action="help-browser">浏览器</button>
          </aside>
          <div class="modal-content">
            <section class="modal-panel__section help-panel">
              ${manual ? `
                <div class="help-section">
                  <div class="help-section__heading"><span class="help-section__dot"></span><h4>操作手册</h4></div>
                  <div class="help-files">
                    ${helpManuals.map((item) => `
                      <button class="help-file" data-action="help-open">
                        <span class="help-file__icon">${icon("doc")}</span>
                        <span class="help-file__meta">
                          <strong>${item.name}</strong>
                          <em>${item.desc}</em>
                        </span>
                        <span class="table-link table-link--ghost">${item.action}</span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              ` : ""}
              ${browser ? `
                <div class="help-section">
                  <div class="help-section__heading"><span class="help-section__dot"></span><h4>浏览器</h4></div>
                  <div class="browser-list">
                    ${helpBrowsers.map((item) => `
                      <button class="browser-card" data-action="help-open">
                        <span>
                          <strong>${item.name}</strong>
                          <span>${item.version}</span>
                        </span>
                        <span class="table-link table-link--ghost">${item.action}</span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              ` : ""}
            </section>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal() {
  const tab = state.workspace.settingsTab;
  const general = `
    <section class="modal-panel__section">
      <h4>快捷键设置</h4>
      <div class="settings-switches">
        ${settingsShortcutRows.map((item) => `
          <div class="switch-card">
            <span>${item.label}</span>
            <em>${item.value}</em>
          </div>
        `).join("")}
      </div>
      <div class="settings-storage">
        <div class="settings-storage__title">缓存文件</div>
        <div class="settings-storage__row">
          <span>日志文件保存至</span>
          <div class="settings-storage__path">
            <span>某某文件夹</span>
            <div class="settings-storage__actions">
              <button class="table-link table-link--ghost" data-action="settings-open-log">打开</button>
              <button class="table-link table-link--ghost" data-action="settings-change-log">更改</button>
            </div>
          </div>
        </div>
        <div class="settings-storage__row">
          <span>日志文件清理</span>
          <div class="settings-storage__path"><span>6个月后执行</span></div>
        </div>
        <p class="modal-copy">当出现异常时，需要点击“打开”提供日志文件至运营人员。</p>
      </div>
      <div class="settings-storage">
        <div class="settings-storage__title">版本信息</div>
        <div class="settings-storage__row">
          <span>当前版本</span>
          <div class="settings-storage__path">
            <span>V1.2.3</span>
            <button class="table-link table-link--ghost" data-action="settings-check-update">检查更新</button>
          </div>
        </div>
      </div>
    </section>
  `;
  const data = `
    <section class="modal-panel__section">
      <h4>数据设置</h4>
      <p class="modal-copy">我的工作台指标展示（最多8个）</p>
      <div class="settings-metrics">
        ${settingsMetricOptions.map((item) => `
          <div class="check-card">
            <span class="cell-check"></span>
            <span>${item}</span>
            <strong>已显示</strong>
          </div>
        `).join("")}
      </div>
      <div class="settings-storage">
        <div class="settings-storage__title">录音策略</div>
        <div class="settings-storage__row"><span>录音永久保存</span><div class="settings-storage__path"><button class="table-link table-link--ghost" data-action="settings-toggle-recording">开启</button></div></div>
        <div class="settings-storage__row"><span>日志文件保存至</span><div class="settings-storage__path"><span>某某文件夹</span><button class="table-link table-link--ghost" data-action="settings-change-log">更改</button></div></div>
      </div>
    </section>
  `;
  const password = `
    <section class="modal-panel__section">
      <h4>密码修改</h4>
      <form class="settings-form">
        <label><span><b>*</b>旧密码</span><input type="password" placeholder="请输入旧密码" /></label>
        <label><span><b>*</b>新密码</span><input type="password" placeholder="请输入新密码" /></label>
        <label><span><b>*</b>请再次输入新密码</span><input type="password" placeholder="请再次输入新密码" /></label>
      </form>
      <div class="password-rules">
        <p>1. 密码长度建议 8-20 位。</p>
        <p>2. 建议同时包含数字、字母和符号。</p>
        <p>3. 新密码不能与旧密码一致。</p>
      </div>
    </section>
  `;
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-panel modal-panel--wide" data-modal-panel="true">
        <div class="modal-panel__header">
          <div>
            <h3>设置</h3>
            <p>常规设置、数据设置和密码修改。</p>
          </div>
          <button class="modal-panel__close" data-action="close-modal">${icon("close")}</button>
        </div>
        <div class="modal-panel__body">
          <aside class="modal-menu">
            <button class="${tab === "general" ? "is-active" : ""}" data-action="settings-general">常规设置</button>
            <button class="${tab === "data" ? "is-active" : ""}" data-action="settings-data">数据设置</button>
            <button class="${tab === "password" ? "is-active" : ""}" data-action="settings-password">密码修改</button>
          </aside>
          <div class="modal-content">
            ${tab === "general" ? general : tab === "data" ? data : password}
            <div class="modal-panel__footer">
              <button class="table-link table-link--ghost" data-action="close-modal">取消</button>
              <button class="table-link" data-action="save-settings">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderConfirmModal() {
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="telephony-confirm" data-modal-panel="true">
        <div class="telephony-confirm__title">${icon("phone")}签出</div>
        <p>是否确认签出</p>
        <div class="telephony-confirm__actions">
          <button class="table-link" data-action="confirm-signout">确定</button>
          <button class="table-link table-link--ghost" data-action="close-modal">取消</button>
        </div>
      </div>
    </div>
  `;
}

function renderModal() {
  if (state.workspace.activeModal === "skill-editor") return renderSkillEditorModal();
  if (state.workspace.activeModal === "settings") return renderSettingsModal();
  if (state.workspace.activeModal === "help") return renderHelpModal();
  if (state.workspace.activeModal === "transfer") return renderTransferModal();
  if (state.workspace.activeModal === "collect") return renderCollectModal();
  if (state.workspace.activeModal === "signout") return renderConfirmModal();
  return "";
}

function renderTopbar() {
  const meta = topbarStatusMeta();
  const showTalkingPills = state.workspace.telephony.status === "talking" || state.workspace.telephony.status === "outbound";
  return `
    <div class="topbar">
      <div class="topbar__left">
        <button class="topbar__icon" data-action="noop">${icon("menu")}</button>
        <span class="status-chip ${meta.chipClass}"><i></i>${meta.label}</span>
        <strong data-clock>${clockText(state.now)}</strong>
        ${renderTopbarCallFlags()}
      </div>
      <div class="topbar__center">
        ${showTalkingPills ? renderTalkingPills() : ""}
      </div>
      <div class="topbar__right">
        <button class="topbar__icon topbar__icon--accent" data-action="open-help" title="帮助">${icon("help")}</button>
        <button class="topbar__icon topbar__icon--signal" data-action="toggle-network" title="网络状态">${icon("signal")}</button>
        <button class="topbar__icon" data-action="open-settings" title="设置">${icon("gear")}</button>
        <button class="topbar__icon" data-action="fullscreen" title="全屏">${icon("fullscreen")}</button>
      </div>
    </div>
  `;
}

function renderWorkspace() {
  return `
    <div class="workspace-page">
      ${renderTopbar()}
      <div class="workspace-shell">
        <aside class="workspace-sidebar">
          <button class="side-nav ${state.workspace.nav === "dashboard" ? "is-active" : ""}" data-action="nav-dashboard">
            <span>${icon("dashboard")}</span>
            <strong>工作台</strong>
          </button>
          <button class="side-nav ${state.workspace.nav === "status" ? "is-active" : ""}" data-action="nav-status">
            <span>${icon("chart")}</span>
            <strong>工作情况</strong>
          </button>
          <button class="side-nav side-nav--logout" data-action="logout-to-login">
            <span>${icon("logout")}</span>
            <strong>退出</strong>
          </button>
        </aside>
        <main class="workspace-main">
          <div class="workspace-main__bar">
            ${renderTelephonyBar()}
          </div>
          ${state.workspace.transferPageOpen
            ? renderTransferPage()
            : state.workspace.settingsPageOpen
            ? renderSettingsPage()
            : state.workspace.helpPageOpen
            ? renderHelpPage()
            : state.workspace.collectPageOpen
              ? renderCollectPage()
              : state.workspace.nav === "dashboard"
                ? renderDashboard()
                : renderWorkStatusV2()}
        </main>
      </div>
      ${state.workspace.showNetworkCard ? `
        <div class="floating-card floating-card--network">
          <div class="floating-card__title">网络状态</div>
          <div class="floating-card__row"><span>线路</span><strong class="is-success">稳定</strong></div>
          <div class="floating-card__row"><span>延迟</span><strong>16 ms</strong></div>
          <div class="floating-card__row"><span>丢包</span><strong>0%</strong></div>
        </div>
      ` : ""}
      ${renderDemoWidgets()}
      ${renderModal()}
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </div>
  `;
}

function renderLogin() {
  const percent = Math.round(state.login.slider);
  const verified = state.login.verified;
  return `
    <div class="login-page">
      <section class="login-card">
        <span class="login-card__halo login-card__halo--one"></span>
        <span class="login-card__halo login-card__halo--two"></span>
        <div class="login-card__inner">
          <div class="login-brand">
            <div class="login-brand__mark">${icon("headset")}</div>
            <h1>呼叫中心应用平台</h1>
            <p>使用账号密码登录，完成滑动验证后进入工作台。</p>
          </div>
          <label class="field">
            <span class="field__icon">${icon("badge")}</span>
            <input class="field__input" data-model="account" value="${state.login.account}" placeholder="请输入账号" />
          </label>
          <label class="field">
            <span class="field__icon">${icon("lock")}</span>
            <input class="field__input" type="${state.login.showPassword ? "text" : "password"}" data-model="password" value="${state.login.password}" placeholder="请输入密码" />
            <button class="field__action" data-action="toggle-password">${icon(state.login.showPassword ? "eye-off" : "eye")}</button>
          </label>
          <div class="slider" data-slider>
            <div class="slider__fill" style="width:${percent}%"></div>
            <div class="slider__label">${verified ? "验证成功" : "向右滑动验证"}</div>
            <button class="slider__handle ${verified ? "is-verified" : ""}" data-slider-handle style="left:calc(${percent}% - ${Math.max(0, percent * 0.54)}px)">${icon("phone-out")}</button>
          </div>
          <p class="form-error">${state.login.error}</p>
          <button class="login-submit" data-action="submit-login">登录</button>
          <div class="login-footer">
            <span class="login-footer__link">${icon("key")}修改密码</span>
            <span class="login-footer__divider"></span>
            <span class="login-footer__link">${icon("download")}手册下载</span>
            <span class="login-footer__divider"></span>
            <span class="login-footer__link">${icon("phone")}网络测试</span>
          </div>
        </div>
      </section>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </div>
  `;
}

function render() {
  app.innerHTML = state.route === "workspace" ? renderWorkspace() : renderLogin();
  syncScrollableSurfaces();
  updateRuntimeFields();
}

const scrollSurfaceTimers = new WeakMap();

function syncScrollableSurfaces() {
  const nodes = app.querySelectorAll("*");
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.classList.remove("scrollbar-surface");
    const style = window.getComputedStyle(node);
    const overflowX = style.overflowX;
    const overflowY = style.overflowY;
    const scrollableX = ["auto", "scroll", "overlay"].includes(overflowX) && node.scrollWidth > node.clientWidth + 1;
    const scrollableY = ["auto", "scroll", "overlay"].includes(overflowY) && node.scrollHeight > node.clientHeight + 1;
    if (scrollableX || scrollableY) node.classList.add("scrollbar-surface");
  });
}

function updateRuntimeFields() {
  const clockNode = document.querySelector("[data-clock]");
  if (clockNode) clockNode.textContent = clockText(state.now);
  const navStatusLabel = document.querySelector('[data-action="nav-status"] strong');
  if (navStatusLabel) navStatusLabel.textContent = "工效";
  const durationNode = document.querySelector("[data-call-duration]");
  if (durationNode) durationNode.textContent = callDuration();
  const muteDurationNode = document.querySelector("[data-mute-duration]");
  if (muteDurationNode) muteDurationNode.textContent = runtimeDuration(state.workspace.telephony.mutedStartedAt);
  const holdDurationNode = document.querySelector("[data-hold-duration]");
  if (holdDurationNode) holdDurationNode.textContent = runtimeDuration(state.workspace.telephony.holdStartedAt);
  if (state.workspace.workRecordPlayerOpen && !state.workspace.workRecordPlayerPaused && state.workspace.workRecordPlayerRowId) {
    const now = Date.now();
    const lastTick = state.workspace.workRecordPlayerLastTick || now;
    const delta = ((now - lastTick) / 1000) * state.workspace.workRecordPlayerRate;
    state.workspace.workRecordPlayerCurrentTime = Math.min(
      state.workspace.workRecordPlayerDuration,
      state.workspace.workRecordPlayerCurrentTime + delta,
    );
    state.workspace.workRecordPlayerLastTick = now;
    if (state.workspace.workRecordPlayerCurrentTime >= state.workspace.workRecordPlayerDuration) {
      state.workspace.workRecordPlayerCurrentTime = state.workspace.workRecordPlayerDuration;
      state.workspace.workRecordPlayerPaused = true;
      state.workspace.workRecordPlayerStatus = "stopped";
      state.workspace.workRecordPlayingId = "";
      state.workspace.workRecordPlayerLastTick = 0;
      render();
      return;
    }
  }
  const playerCurrentNode = document.querySelector("[data-work-record-player-current]");
  if (playerCurrentNode) playerCurrentNode.textContent = formatPlayerTime(state.workspace.workRecordPlayerCurrentTime);
  const playerDurationNode = document.querySelector("[data-work-record-player-duration]");
  if (playerDurationNode) playerDurationNode.textContent = formatPlayerTime(state.workspace.workRecordPlayerDuration);
  const playerProgressNode = document.querySelector("[data-work-record-player-progress]");
  if (playerProgressNode) playerProgressNode.style.width = `${workRecordPlayerProgress()}%`;
}

function login() {
  if (!state.login.verified) {
    state.login.error = "请先完成滑动验证";
    render();
    return;
  }
  const account = state.login.account.trim();
  const password = state.login.password.trim();
  if (!account || !password) {
    state.login.error = "请输入账号和密码";
    render();
    return;
  }
  state.login.account = account;
  state.login.password = password;
  state.login.error = "";
  state.route = "workspace";
  saveRoute();
  setToast("登录成功");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.classList.contains("modal-backdrop") && event.target !== target) return;
  const action = target.dataset.action;

  if (action === "close-modal") state.workspace.activeModal = "";
  if (action === "submit-login") login();
  if (action === "toggle-password") state.login.showPassword = !state.login.showPassword;
  if (action === "toggle-incoming-demo-minimize") state.workspace.incomingDemoMinimized = !state.workspace.incomingDemoMinimized;
  if (action === "toggle-transfer-demo-minimize") state.workspace.transferDemoMinimized = !state.workspace.transferDemoMinimized;
  if (action === "toggle-work-record-player-minimize") state.workspace.workRecordPlayerMinimized = !state.workspace.workRecordPlayerMinimized;
  if (action === "close-work-record-player") closeWorkRecordPlayer();
  if (action === "signin-pc") signIn("pc");
  if (action === "signin-mobile") signIn("mobile");
  if (action === "panel-skills") state.workspace.sidePanel = "skills";
  if (action === "panel-notes") state.workspace.sidePanel = "notes";
  if (action === "skill-summary-toggle" && target.dataset.value) toggleSkillSummaryBranch(target.dataset.value);
  if (action === "open-skill-editor") openSkillEditorModal();
  if (action === "skill-editor-cancel") state.workspace.activeModal = "";
  if (action === "skill-editor-save") {
    state.workspace.skillEditorSelectedKeys = cloneSkillEditorMap(state.workspace.skillEditorDraftSelectedKeys);
    state.workspace.skillSummaryGroups = buildSkillSummaryGroupsFromSelections(state.workspace.skillEditorSelectedKeys);
    state.workspace.activeModal = "";
    setToast("技能设置已更新");
    return;
  }
  if (action === "logout-to-login") logoutToLogin();
  if (action === "skill-editor-toggle-branch" && target.dataset.column && target.dataset.value) {
    const columnKey = target.dataset.column;
    const branchKey = target.dataset.value;
    const current = state.workspace.skillEditorExpandedKeys[columnKey] || [];
    state.workspace.skillEditorExpandedKeys = {
      ...state.workspace.skillEditorExpandedKeys,
      [columnKey]: current.includes(branchKey)
        ? current.filter((item) => item !== branchKey)
        : [...current, branchKey],
    };
  }
  if (action === "skill-editor-toggle-item" && target.dataset.column && target.dataset.value) {
    toggleSkillEditorItem(target.dataset.column, target.dataset.value);
  }
  if (action === "nav-dashboard") {
    state.workspace.transferPageOpen = false;
    state.workspace.settingsPageOpen = false;
    state.workspace.collectPageOpen = false;
    state.workspace.helpPageOpen = false;
    state.workspace.nav = "dashboard";
  }
  if (action === "nav-status") {
    state.workspace.transferPageOpen = false;
    state.workspace.settingsPageOpen = false;
    state.workspace.collectPageOpen = false;
    state.workspace.helpPageOpen = false;
    state.workspace.nav = "status";
  }
  if (action === "work-tab-efficiency") state.workspace.workStatusTab = "efficiency";
  if (action === "work-tab-records") state.workspace.workStatusTab = "records";
  if (action === "work-efficiency-query") setToast("工效统计已刷新");
  if (action === "work-record-query") setToast("通话记录已按条件筛选");
  if (action === "work-record-reset") resetWorkRecordFilters();
  if (action === "work-record-callback" && target.dataset.id) startWorkRecordCallback(target.dataset.id);
  if (action === "work-record-collect" && target.dataset.id) openWorkRecordCollect(target.dataset.id);
  if (action === "work-record-play" && target.dataset.id) toggleWorkRecordPlayback(target.dataset.id);
  if (action === "work-record-player-play") resumeWorkRecordPlayer();
  if (action === "work-record-player-pause") pauseWorkRecordPlayer();
  if (action === "work-record-player-stop") stopWorkRecordPlayer();
  if (action === "work-record-player-forward") fastForwardWorkRecordPlayer(15);
  if (action === "work-record-player-rate" && target.dataset.value) setWorkRecordPlayerRate(Number(target.dataset.value));
  if (action === "toggle-busy") {
    state.workspace.telephony.status = state.workspace.telephony.status === "busy" ? "idle" : "busy";
    state.workspace.telephony.busyAfterHangup = false;
  }
  if (action === "set-idle-now") {
    clearWrapupTimer();
    state.workspace.telephony.status = "idle";
    state.workspace.telephony.busyAfterHangup = false;
  }
  if (action === "toggle-ring") {
    state.workspace.telephony.ringMuted = !state.workspace.telephony.ringMuted;
    state.workspace.telephony.muted = state.workspace.telephony.ringMuted;
  }
  if (action === "toggle-dialer") state.workspace.telephony.showDialer = !state.workspace.telephony.showDialer;
  if (action === "incoming-demo-start") startIncomingDemoCall();
  if (action === "incoming-demo-hangup") {
    if (state.workspace.telephony.status === "incoming") rejectIncomingDemoCall();
    else hangupCall();
  }
  if (action === "answer-incoming-call") answerIncomingDemoCall();
  if (action === "reject-incoming-call") rejectIncomingDemoCall();
  if (action === "select-outbound-source") {
    state.workspace.telephony.outboundSource = target.dataset.value || outboundSourceNumbers[0];
    state.workspace.telephony.outboundSourceIndex = Number(target.dataset.index || 0);
    state.workspace.telephony.queueNumber = state.workspace.telephony.outboundSource;
  }
  if (action === "clear-dialer") state.workspace.telephony.dialNumber = "";
  if (action === "toggle-keypad") setToast("鍙洿鎺ヨ緭鍏ヨ鍙彿鐮?");
  if (action === "start-outbound") startOutbound();
  if (action === "toggle-call-mute") setCallMute(!state.workspace.telephony.muted);
  if (action === "toggle-hold") setCallHold(!state.workspace.telephony.hold);
  if (action === "toggle-busy-after") state.workspace.telephony.busyAfterHangup = !state.workspace.telephony.busyAfterHangup;
  if (action === "open-call-records") openCallRecordPage();
  if (action === "toggle-red") state.workspace.telephony.redMarked = !state.workspace.telephony.redMarked;
  if (action === "hangup") hangupCall();
  if (action === "hangup-rated") {
    hangupCall("rated");
    setToast("满意度挂机已完成");
  }
  if (action === "call-monitor") setToast("已打开监听面板");
  if (action === "call-assist") setToast("已打开呼叫辅助");
  if (action === "open-transfer") openTransferPage();
  if (action === "open-collect") openCollectPage();
  if (action === "open-help") openHelpPage();
  if (action === "open-settings") openSettingsPage();
  if (action === "open-signout") state.workspace.activeModal = "signout";
  if (action === "confirm-signout") signOut();
  if (action === "close-transfer-page") closeTransferPage();
  if (action === "close-collect-page") closeCollectPage();
  if (action === "close-help-page") closeHelpPage();
  if (action === "settings-cancel-page" || action === "close-settings-page") closeSettingsPage();
  if (action === "toggle-network") state.workspace.showNetworkCard = !state.workspace.showNetworkCard;
  if (action === "fullscreen") toggleFullscreen();
  if (action === "settings-general") state.workspace.settingsTab = "general";
  if (action === "settings-data") state.workspace.settingsTab = "data";
  if (action === "settings-password") state.workspace.settingsTab = "password";
  if (action === "settings-toggle-autostart") state.workspace.settingsAutoStart = !state.workspace.settingsAutoStart;
  if (action === "settings-window-mode" && target.dataset.value) state.workspace.settingsWindowMode = target.dataset.value;
  if (action === "settings-toggle-shortcut" && target.dataset.value) {
    state.workspace.settingsShortcutSelection = toggleSelection(state.workspace.settingsShortcutSelection, target.dataset.value);
  }
  if (action === "settings-toggle-metric" && target.dataset.value) {
    state.workspace.settingsMetricSelection = toggleSelection(state.workspace.settingsMetricSelection, target.dataset.value);
  }
  if (action === "settings-save-page") {
    closeSettingsPage();
    setToast("设置已保存");
  }
  if (action === "help-manual") state.workspace.helpSection = "manual";
  if (action === "help-browser") state.workspace.helpSection = "browser";
  if (action === "transfer-seat") state.workspace.transferTab = "seat";
  if (action === "transfer-external") state.workspace.transferTab = "external";
  if (action === "transfer-skill") state.workspace.transferTab = "skill";
  if (action === "transfer-toggle-seat-idle") state.workspace.transferSeatOnlyIdle = !state.workspace.transferSeatOnlyIdle;
  if (action === "transfer-toggle-seat-direct") state.workspace.transferSeatDirect = !state.workspace.transferSeatDirect;
  if (action === "transfer-toggle-seat" && target.dataset.id) {
    state.workspace.transferSeatSelectedIds = toggleSingleSelection(state.workspace.transferSeatSelectedIds, target.dataset.id);
  }
  if (action === "transfer-seat-page" && target.dataset.page) {
    state.workspace.transferSeatPage = Number(target.dataset.page) || 1;
  }
  if (action === "transfer-toggle-external" && target.dataset.id) {
    state.workspace.transferExternalSelectedIds = toggleSingleSelection(state.workspace.transferExternalSelectedIds, target.dataset.id);
    if (state.workspace.transferExternalSelectedIds.length) {
      state.workspace.transferExternalNumber = "";
    }
  }
  if (action === "transfer-external-page" && target.dataset.page) {
    state.workspace.transferExternalPage = Number(target.dataset.page) || 1;
  }
  if (action === "transfer-toggle-skill" && target.dataset.id) state.workspace.transferSkillSelectedId = target.dataset.id;
  if (action === "transfer-select-tree" && target.dataset.value) {
    state.workspace.transferSkillTreeSelection = target.dataset.value;
    state.workspace.transferSkillPage = 1;
    const visibleRows = transferVisibleSkillRows();
    if (!visibleRows.some((item) => item.id === state.workspace.transferSkillSelectedId)) {
      state.workspace.transferSkillSelectedId = visibleRows[0]?.id || "";
    }
  }
  if (action === "transfer-toggle-tree" && target.dataset.value) {
    state.workspace.transferSkillExpandedKeys = state.workspace.transferSkillExpandedKeys.includes(target.dataset.value)
      ? state.workspace.transferSkillExpandedKeys.filter((item) => item !== target.dataset.value)
      : [...state.workspace.transferSkillExpandedKeys, target.dataset.value];
  }
  if (action === "transfer-skill-page" && target.dataset.page) {
    state.workspace.transferSkillPage = Number(target.dataset.page) || 1;
  }
  if (action === "transfer-query" && state.workspace.transferTab === "seat") {
    state.workspace.transferSeatPage = 1;
  }
  if (action === "transfer-query" && state.workspace.transferTab === "external") {
    state.workspace.transferExternalPage = 1;
  }
  if (action === "transfer-query" && state.workspace.transferTab === "skill") {
    state.workspace.transferSkillPage = 1;
  }
  if (action === "transfer-query") setToast("转接查询条件已生效");
  if (action === "transfer-reset") {
    if (state.workspace.transferTab === "seat") {
      state.workspace.transferSeatScope = "";
      state.workspace.transferSeatSkillGroup = "";
      state.workspace.transferSeatRole = "";
      state.workspace.transferSeatPermission = "";
      state.workspace.transferSeatTeam = "";
      state.workspace.transferSeatPerson = "";
      state.workspace.transferSeatOnlyIdle = true;
      state.workspace.transferSeatPage = 1;
      state.workspace.transferSeatExtraInfo = "";
    }
    if (state.workspace.transferTab === "external") {
      state.workspace.transferExternalScope = "";
      state.workspace.transferExternalDescription = "";
      state.workspace.transferExternalPage = 1;
      state.workspace.transferExternalNumber = "";
    }
    if (state.workspace.transferTab === "skill") {
      state.workspace.transferSkillName = "";
      state.workspace.transferSkillCode = "";
      state.workspace.transferSkillTreeSelection = "hotline-center";
      state.workspace.transferSkillPage = 1;
      state.workspace.transferSkillExpandedKeys = [...transferSkillExpandedDefaultKeys];
      state.workspace.transferSkillSelectedId = transferSkillPageRows12345[0]?.id || "";
      state.workspace.transferSkillExtraInfo = "";
    }
  }
  if (action === "transfer-exit") closeTransferPage();
  if (action === "transfer-start-assist") openTransferAssistDemo();
  if (action === "transfer-three-way") startThreeWayTransferAssist();
  if (action === "transfer-confirm-assist") {
    hangupCall("transfer-confirm");
    setToast("已确认互助转接");
  }
  if (action === "transfer-cancel-assist") cancelTransferAssistDemo();
  if (action === "transfer-demo-answer") answerTransferAssistDemo();
  if (action === "transfer-demo-hangup") handleTransferDemoRemoteHangup();
  
  if (action === "transfer-release") {
    if (["talking", "outbound"].includes(state.workspace.telephony.status)) {
      closeTransferPage();
      hangupCall("transfer-release");
      setToast("已执行释放转，当前坐席已挂机");
    } else {
      setToast("请在通话中发起释放转");
    }
  }

  if (action === "transfer-cancel-suspend") {
    if (state.workspace.transferDemoStage !== "suspend-waiting") return;
    setToast("已取消转接");
    resetTransferDemoState();
  }

  if (action === "transfer-suspend") {
    if (!["talking", "outbound"].includes(state.workspace.telephony.status)) {
      setToast("请在通话中发起挂起转");
      return;
    }
    
    let seatName = "";
    let seatCode = "";
    let remark = "";
    
    if (state.workspace.transferTab === "seat") {
      const selectedSeat = selectedTransferSeatRow();
      if (!selectedSeat) return setToast("请先选择转接坐席");
      seatName = selectedSeat.name;
      seatCode = selectedSeat.code;
      remark = state.workspace.transferSeatExtraInfo.trim();
    } else if (state.workspace.transferTab === "external") {
      const selectedIds = state.workspace.transferExternalSelectedIds;
      if (!selectedIds.length) return setToast("请先选择外线");
      const { rows } = transferExternalPageState();
      const selectedRow = rows.find((r) => selectedIds.includes(r.id)) || transferExternalPageRows[0];
      seatName = selectedRow.note || "外线号码";
      seatCode = selectedRow.number;
      remark = state.workspace.transferExternalNumber || "";
    } else if (state.workspace.transferTab === "skill") {
      const selectedId = state.workspace.transferSkillSelectedId;
      if (!selectedId) return setToast("请先选择技能组");
      const { rows } = transferSkillPageState();
      const selectedRow = rows.find((r) => r.id === selectedId) || transferSkillPageRows12345.find((r) => r.id === selectedId) || rows[0];
      seatName = selectedRow.name;
      seatCode = selectedRow.code;
      remark = state.workspace.transferSkillExtraInfo.trim();
    }

    state.workspace.transferDemoSeatName = seatName;
    state.workspace.transferDemoSeatCode = seatCode;
    state.workspace.transferDemoRemark = remark;
    state.workspace.transferDemoMinimized = false;
    setTransferAssistStage("suspend-waiting");
    setToast("已发起挂起转，等待接话");
  }

  if (action === "transfer-suspend-answer") {
    if (state.workspace.transferDemoStage !== "suspend-waiting") return;
    setToast("转接对象已接话，当前坐席已挂机");
    hangupCall("transfer-suspend");
    resetTransferDemoState();
    closeTransferPage();
  }

  if (action === "transfer-footer-action") {
    const label = target.dataset.label || "";
    setToast(`${label || "转接操作"}已接入演示交互`);
  }
  if (action === "collect-current") state.workspace.collectTab = "current";
  if (action === "collect-history") state.workspace.collectTab = "history";
  if (action === "collect-page-tab" && target.dataset.value && state.workspace.collectTab !== target.dataset.value) {
    state.workspace.collectTab = target.dataset.value;
    clearCollectSelection();
  }
  if (action === "collect-tree-select" && target.dataset.value) {
    state.workspace.collectTreeSelection = target.dataset.value;
    if (state.workspace.collectKeyword === "某某") state.workspace.collectKeyword = "";
  }
  if (action === "collect-toggle-branch" && target.dataset.value) {
    const branchKey = target.dataset.value;
    state.workspace.collectExpandedKeys = state.workspace.collectExpandedKeys.includes(branchKey)
      ? state.workspace.collectExpandedKeys.filter((item) => item !== branchKey)
      : [...state.workspace.collectExpandedKeys, branchKey];
  }
  if (action === "collect-toggle-item" && target.dataset.id) toggleCollectItem(target.dataset.id);
  if (action === "collect-remove-item" && target.dataset.id) {
    state.workspace.collectSelectedIds = state.workspace.collectSelectedIds.filter((item) => item !== target.dataset.id);
  }
  if (action === "collect-toggle-keep") state.workspace.collectKeepRecording = !state.workspace.collectKeepRecording;
  if (action === "collect-clear-keyword") state.workspace.collectKeyword = "";
  if (action === "collect-scene-policy") state.workspace.collectScene = "policy";
  if (action === "collect-scene-info") state.workspace.collectScene = "info";
  if (action === "collect-scene-query") state.workspace.collectScene = "query";
  if (action === "collect-category") state.workspace.collectCategory = target.dataset.value;
  if (action === "collect-confirm-page") {
    closeCollectPage();
    setToast("采集内容已确认");
  }
  if (
    action === "help-open" ||
    action === "table-op" ||
    action === "save-settings" ||
    action === "profile-edit" ||
    action === "settings-open-log" ||
    action === "settings-change-log" ||
    action === "settings-check-update" ||
    action === "settings-toggle-recording" ||
    action === "collect-search" ||
    action === "collect-favorite" ||
    action === "help-download"
  ) {
    setToast("交互已接入演示状态");
  }

  render();
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
  const model = target.dataset.model;
  if (!model) return;
  if (model === "account") state.login.account = target.value;
  if (model === "password") state.login.password = target.value;
  if (model === "note") state.workspace.note = target.value;
  if (model === "dialNumber") state.workspace.telephony.dialNumber = target.value;
  if (model === "collectKeyword") state.workspace.collectKeyword = target.value;
  if (model === "collectAcceptedNumber") state.workspace.collectAcceptedNumber = target.value;
  if (model === "collectRemark") state.workspace.collectRemark = target.value;
  if (model === "transferSeatScope") state.workspace.transferSeatScope = target.value;
  if (model === "transferSeatSkillGroup") state.workspace.transferSeatSkillGroup = target.value;
  if (model === "transferSeatRole") state.workspace.transferSeatRole = target.value;
  if (model === "transferSeatPermission") state.workspace.transferSeatPermission = target.value;
  if (model === "transferSeatTeam") state.workspace.transferSeatTeam = target.value;
  if (model === "transferSeatPerson") state.workspace.transferSeatPerson = target.value;
  if (model === "transferExternalScope") state.workspace.transferExternalScope = target.value;
  if (model === "transferExternalDescription") state.workspace.transferExternalDescription = target.value;
  if (model === "transferExternalNumber") {
    state.workspace.transferExternalNumber = target.value;
    if (target.value.trim()) state.workspace.transferExternalSelectedIds = [];
  }
  if (model === "transferSeatExtraInfo") state.workspace.transferSeatExtraInfo = target.value;
  if (model === "incomingDemoNumber") state.workspace.incomingDemoNumber = target.value;
  if (model === "workEfficiencyDateFrom") state.workspace.workEfficiencyDateFrom = target.value;
  if (model === "workEfficiencyDateTo") state.workspace.workEfficiencyDateTo = target.value;
  if (model === "workRecordCaller") state.workspace.workRecordCaller = target.value;
  if (model === "workRecordCallee") state.workspace.workRecordCallee = target.value;
  if (model === "workRecordSatisfactionType") state.workspace.workRecordSatisfactionType = target.value;
  if (model === "workRecordCallType") state.workspace.workRecordCallType = target.value;
  if (model === "workRecordHangupReason") state.workspace.workRecordHangupReason = target.value;
  if (model === "workRecordCity") state.workspace.workRecordCity = target.value;
  if (model === "workRecordCollected") state.workspace.workRecordCollected = target.value;
  if (model === "workRecordCrossProvince") state.workspace.workRecordCrossProvince = target.value;
  if (model === "workRecordProvince") state.workspace.workRecordProvince = target.value;
  if (model === "workRecordDateFrom") state.workspace.workRecordDateFrom = target.value;
  if (model === "workRecordDateTo") state.workspace.workRecordDateTo = target.value;
  if (model === "transferSkillName") state.workspace.transferSkillName = target.value;
  if (model === "transferSkillCode") state.workspace.transferSkillCode = target.value;
  if (model === "transferSkillExtraInfo") state.workspace.transferSkillExtraInfo = target.value;
  if (model === "settingsLogFolder") state.workspace.settingsLogFolder = target.value;
  if (model === "settingsLogCleanup") state.workspace.settingsLogCleanup = target.value;
  if (model === "settingsOldPassword") state.workspace.settingsOldPassword = target.value;
  if (model === "settingsNewPassword") state.workspace.settingsNewPassword = target.value;
  if (model === "settingsConfirmPassword") state.workspace.settingsConfirmPassword = target.value;
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  const model = target.dataset.model;
  if (!model) return;
  if (model === "workRecordSatisfactionType") state.workspace.workRecordSatisfactionType = target.value;
  if (model === "workRecordCallType") state.workspace.workRecordCallType = target.value;
  if (model === "workRecordHangupReason") state.workspace.workRecordHangupReason = target.value;
  if (model === "workRecordCity") state.workspace.workRecordCity = target.value;
  if (model === "workRecordCollected") state.workspace.workRecordCollected = target.value;
  if (model === "workRecordCrossProvince") state.workspace.workRecordCrossProvince = target.value;
  if (model === "workRecordProvince") state.workspace.workRecordProvince = target.value;
  render();
});

document.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest("[data-slider-handle]");
  if (!handle) return;
  const slider = document.querySelector("[data-slider]");
  if (!slider || state.login.verified) return;
  dragState.active = true;
  dragState.rect = slider.getBoundingClientRect();
});

document.addEventListener("pointermove", (event) => {
  if (!dragState.active || !dragState.rect) return;
  const current = Math.min(Math.max(event.clientX - dragState.rect.left, 0), dragState.rect.width);
  state.login.slider = (current / dragState.rect.width) * 100;
  if (state.login.slider >= 94) {
    state.login.slider = 100;
    state.login.verified = true;
    dragState.active = false;
  }
  render();
});

document.addEventListener("pointerup", () => {
  if (!dragState.active) return;
  dragState.active = false;
  if (!state.login.verified) {
    state.login.slider = 0;
    render();
  }
});

document.addEventListener("scroll", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains("scrollbar-surface")) return;
  target.classList.add("is-scrolling");
  const prevTimer = scrollSurfaceTimers.get(target);
  if (prevTimer) window.clearTimeout(prevTimer);
  const timer = window.setTimeout(() => {
    target.classList.remove("is-scrolling");
    scrollSurfaceTimers.delete(target);
  }, 900);
  scrollSurfaceTimers.set(target, timer);
}, true);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (state.route !== "login") return;
  login();
});

window.setInterval(() => {
  state.now = Date.now();
  updateRuntimeFields();
}, 1000);

render();
