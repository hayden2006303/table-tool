<template>
  <div>
    <Table
      ref="table"
      :params="paraObj"
      :loadData="loadData"
      :searchs="searchs"
      :isDefault="true"
      :columns="columns"
      @selectChange="selectChange"
    >
      <template #operBtns>
        <div>
          <!-- <a-button @click="shareBenefit()">分润</a-button> -->
          <a-modal
            :visible="visible"
            ok-text="确认"
            cancel-text="取消"
            @ok="handleOk"
            @cancel="visible = false"
          >
            <p>{{ ModalText }}</p>
          </a-modal>
          <a-button @click="exportFile()">导出数据</a-button>
          <a-button @click="openExportRecord()">导出记录</a-button>
        </div>
      </template>
      <template #status="record">
        <span>{{ record.status | stateFilter }}</span>
      </template>
      <template slot="action" slot-scope="item">
        <div>
          <a-button type="link" @click="handleDetail(item)">
            订单详情
          </a-button>
        </div>
      </template>
    </Table>
  </div>
</template>
<script>
import moment from 'moment';
import { filtersMixin } from '@/common/mixins';

export default {
  mixins: [filtersMixin],
  name: 'specialCarList',

  data() {
    return {
      visiable: false,
      title: '',
      icon: 'close-circle',
      iconColor: '',
      tipMessage: '',
      dataList: [],
      popupShow: false,
      ModalText: '是否确定分润?',
      visible: false,
      paraObj: {
        pageSize: 20,
        currentPage: 1,
        type: 1
      },
      selectedRows: [],
      selectedRowKeys: [],
      loadData: (data) => {

        return new Promise((resolve, reject) => {
          resolve({
            data: {
              code: 0,
              data: [{
                id: 1, no: 125698, operatorName: '重庆运力', status: 1, createOrderTime: '2021-01-12 08:22', appointDate: '2021-01-12', driverName: '王二小',
                carNo: '渝A00006', startLocation: '重庆市渝中区解放碑', endLocation: '重庆市江北区光电园',
              }]
            }
          })
        });
      },
      columns: [
        {
          title: '订单标识',
          width: 100,
          align: 'left',
          dataIndex: 'id',
        },
        {
          title: '订单编号',
          dataIndex: 'no',
          align: 'left',
          width: 210,
          fixed: 'left',
        },
        {
          title: '运力名称',
          dataIndex: 'operatorName',
          align: 'left',
          width: 140,
          fixed: 'left',
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' },
          align: 'left',
          fixed: 'left',
          width: 150,
        },
        {
          title: '下单时间',
          dataIndex: 'createOrderTime',
          align: 'center',
          width: 200,
        },
        {
          title: '用车时间',
          dataIndex: 'appointDate',
          align: 'center',
          width: 200,
        },
        {
          title: '司机',
          dataIndex: 'driverName',
          align: 'left',
          width: 100,
        },
        {
          title: '车牌号',
          dataIndex: 'carNo',
          align: 'center',
          width: 130,
        },
        {
          title: '出发地',
          dataIndex: 'startLocation',
          align: 'left',
          width: 200,
        },
        { title: '目的地', dataIndex: 'endLocation', align: 'left', width: 200 },
        { title: '操作', scopedSlots: { customRender: 'action' }, align: 'center', width: 100 },
      ],
      searchs: [
        {
          title: '订单编号',
          dataIndex: 'no',
          type: 'input',
        },
        {
          title: '渠道订单',
          placeHolder: '渠道订单号',
          dataIndex: 'channelNo',
          type: 'input',
        },
        {
          title: '司机',
          dataIndex: 'driver',
          placeHolder: '司机姓名/手机',
          type: 'input',
        },
        {
          title: '车牌号码',
          dataIndex: 'carNo',
          type: 'input',
        },
        {
          title: '乘客',
          dataIndex: 'membership',
          placeHolder: '乘客姓名/手机',
          type: 'input',
        },
        {
          title: '出发城市',
          dataIndex: 'city',
          type: 'input',
        },
        {
          title: '到达城市',
          dataIndex: 'endCity',
          type: 'input',
        },
        {
          title: '行程编号',
          dataIndex: 'lineId',
          type: 'input',
        },
        {
          title: '订单来源',
          dataIndex: 'source',
          type: 'select',
          options: [],
        },
        {
          title: '订单状况',
          dataIndex: 'status',
          type: 'selectAll',
          options: [],
        },
        {
          title: '服务商',
          dataIndex: 'merchant',
          type: 'selectSearch',
          options: [],
          change: 1
        },
        {
          title: '用车时间',
          dataIndex: ['startDateToTime', 'endDateToTime'],
          type: 'datetime',
        },
        {
          title: '下单时间',
          dataIndex: ['startCreateDate', 'endCreateDate'],
          type: 'datetime',
        },
      ],
    };
  },
  filters: {
    stateFilter(val) {
      switch (val) {
        case 1:
          return '待派单';
          break;
        case 2:
          return '抢单待确认';
          break;
        case 3:
          return '确认接单';
          break;
        case 4:
          return '到达上车点';
          break;
        case -4:
          return '等待上车';
          break;
        case 5:
          return '行程中';
          break;
        case 6:
          return '行程结束';
          break;
        case 60:
          return '发起收款';
          break;
        case -60:
          return '快车待支付';
          break;
        case 7:
          return '订单完成(已付款)';
          break;
        case 8:
          return '已评价';
          break;
        case -1:
          return '已取消(无责)';
          break;
        case -2:
          return '已取消(有责未付)';
          break;
        case -21:
          return '平台垫付';
          break;
        case -22:
          return '已取消(有责已付)';
          break;
        case 100:
          return '订单关闭';
          break;
        case 70:
          return '已付款待确认';
          break;
        default:
          return '';
          break;
      }
    },
  },
  mounted() {
    this.getMerchantLsit()
    this.getOrderStatus()
  },
  methods: {
    //下拉搜索事件
    selectChange(e, change) {
      console.log(e, change)
    },

    // 订单状况
    getOrderStatus() {
      this.searchs[9].options = [{ value: 1, label: '待派单' }, { value: 2, label: '抢单待确认' }, { value: 3, label: '确认接单' }]
    },

    // 查询服务商列表
    getMerchantLsit() {
      this.searchs[10].options = [{ value: 1, label: '服务商1' }, { value: 2, label: '服务商2' }, { value: 3, label: '服务商3' }]
    },
    // 导出按钮方法
    exportFile() {
    },
    // 关闭导出记录弹窗
    close(v) {
      this.popupShow = v
    },

    // 打开导出记录弹窗
    openExportRecord() {

    },
    handleOk() {
      this.visible = false;
    },
    // 过滤字典
    flutterDic(arr) {
      const arrDic = [];
      arr.forEach((item) => {
        arrDic.push({
          label: item.value,
          value: item.code,
        });
      });
      return arrDic;
    },
    handleDetail(row) {
      return this.$router.push({
        path: 'zcOrderDetails',
        query: {
          id: row.id,
          // type: 'fast',
        },
      });
    },
    shareBenefit() {
      this.visible = true;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows;
      this.selectedRowKeys = selectedRowKeys;
    },

  },
};
</script>
