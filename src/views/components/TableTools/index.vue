<template>
  <div class="mainbox" ref="element">
    <div
      class="search-box"
      ref="searchbox"
      v-if="searchs.length > 0"
      :style="{ marginbottom: type == 1 || type == 3 ? 0 : '10px' }"
    >
      <a-form
        class="ant-advanced-search-form form-box"
        :style="{ padding: type == 1 || type == 3 ? 0 : '10px' }"
        :form="form"
        @submit="handleSearch"
        layout="inline"
      >
        <a-row :gutter="5" style="flex: 0 0 83%">
          <a-col
            v-for="(item, i) in searchs"
            :key="i"
            v-bind="item.type == 'date' ? itemCol1 : itemCol"
            :style="{ display: i < count ? 'block' : 'none' }"
            :xs="20"
            :sm="16"
            :md="12"
            :lg="8"
            :xl="6"
            :xxl="4"
          >
            <a-form-item
              :label="item.title"
              :label-col="item.type == 'date' ? labelCol1 : labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-time-picker
                v-model="item.data"
                v-if="item.type == 'time'"
                :locale="locale"
                placeholder="选择时间"
              />
              <a-month-picker
                :disabled-date="disabledDate"
                placeholder="选择月份"
                v-model="item.data"
                v-if="item.type == 'monthTime'"
              />
              <a-date-picker
                v-model="item.data"
                v-if="item.type == 'date-one'"
                :locale="locale"
              />
              <a-input
                :placeholder="item.placeHolder || item.title"
                v-if="item.type == 'input'"
                v-model.trim="item.data"
                @blur="() => $forceUpdate()"
              />

              <a-range-picker
                format="YYYY-MM-DD"
                v-if="item.type == 'date'"
                v-model.trim="item.rangeTime"
                :locale="locale"
                :disabled-date="disabledDate"
              />

              <a-range-picker
                :ranges="{
                  今天: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('23:59:59', 'HH:mm:ss'),
                  ],
                  当月: [moment().startOf('month'), moment().endOf('month')],
                }"
                :showTime="{
                  defaultValue: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('23:59:59', 'HH:mm:ss'),
                  ],
                }"
                format="YYYY-MM-DD HH:mm:ss"
                v-if="item.type == 'datetime'"
                v-model.trim="item.rangeTime"
                :locale="locale"
                style="width: auto"
              />

              <a-cascader
                :load-data="
                  (val) => {
                    loadCityData(val, i);
                  }
                "
                :options="item.options"
                :placeholder="`请选择${item.title}`"
                v-if="item.type == 'area'"
                v-model.trim="item.data"
                change-on-select
                :field-names="{
                  label: 'name',
                  level: 'level',
                  value: 'name',
                  children: 'children',
                }"
                @change="cityChange($event, item)"
              />
              <a-select
                v-if="item.type == 'select' && item.dic"
                v-model.trim="item.data"
                @change="ChangeSelect"
                :placeholder="`请选择${item.title}`"
                :allowClear="true"
              >
                <a-select-option
                  :value="op.code"
                  v-for="op in types"
                  :key="op.code"
                  :title="op.value.length > 6 ? op.value : ''"
                >
                  {{ op.value }}
                </a-select-option>
              </a-select>

              <a-select
                v-if="item.type == 'select' && !item.dic"
                v-model.trim="item.data"
                @change="ChangeSelect"
                :placeholder="`请选择${item.title}`"
                :allowClear="true"
              >
                <a-select-option
                  :value="op.value"
                  v-for="op in item.options"
                  :key="op.value"
                  :title="op.label.length > 6 ? op.label : ''"
                >
                  {{ op.label }}
                </a-select-option>
              </a-select>
              <a-select
                v-if="item.type == 'selectSearch' && !item.change"
                @change="ChangeSelect"
                v-model.trim="item.data"
                :filter-option="filterOption"
                show-search
                :placeholder="`请选择${item.title}`"
                :allowClear="true"
              >
                <a-select-option
                  :value="op.value"
                  v-for="op in item.options"
                  :key="op.value"
                  :title="op.label.length > 6 ? op.label : ''"
                >
                  {{ op.label }}
                </a-select-option>
              </a-select>
              <a-select
                v-if="item.type == 'selectSearch' && item.change"
                @change="ChangeLinkage($event, item.change)"
                v-model.trim="item.data"
                :filter-option="filterOption"
                show-search
                :placeholder="`请选择${item.title}`"
                :allowClear="true"
              >
                <a-select-option
                  :value="op.value"
                  v-for="op in item.options"
                  :key="op.value"
                  :title="op.label.length > 6 ? op.label : ''"
                >
                  {{ op.label }}
                </a-select-option>
              </a-select>
              <a-select
                v-if="item.type == 'selectChange'"
                @change="ChangeLinkage"
                v-model.trim="item.data"
                :placeholder="`请选择${item.title}`"
                :allowClear="true"
              >
                <a-select-option
                  :value="op.value"
                  v-for="op in item.options"
                  :key="op.value"
                  :title="op.label.length > 6 ? op.label : ''"
                >
                  {{ op.label }}
                </a-select-option>
              </a-select>
              <a-select
                mode="multiple"
                v-if="item.type == 'selectAll'"
                @change="handleChange"
                v-model="item.data"
                :placeholder="`请选择${item.title}`"
              >
                <a-select-option
                  v-for="op in item.options"
                  :key="op.value"
                  :disabled="op.disabled"
                  :title="op.label.length > 6 ? op.label : ''"
                >
                  {{ op.label }}
                </a-select-option>
              </a-select>

              <a-auto-complete
                v-if="item.type == 'selectComplete'"
                v-model="item.data"
                @change="ChangeSelect"
                :placeholder="`请选择或者输入${item.title}`"
                :allowClear="true"
                :data-source="item.options"
              >
              </a-auto-complete>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="margin-right: 0px">
          <a-col :style="{ textAlign: 'right' }" v-bind="searchBtns" :span="24">
            <a-button type="primary" @click="handleSearch"> 搜索 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="reset">
              重置
            </a-button>
            <a
              :style="{ marginLeft: '8px', fontSize: '12px' }"
              @click="toggle"
              v-if="searchs.length > 12"
            >
              {{ expand ? "展开" : "收起" }}
              <a-icon :type="expand ? 'down' : 'up'" />
            </a>
          </a-col>
        </a-row>
      </a-form>
      <div style="padding: 0 0 5px 10px" v-if="tips">{{ tips }}</div>
    </div>

    <div
      class="table-box"
      v-loading="$store.state.loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      :style="{
        padding: type == 1 || type == 3 ? 0 : '10px',
        height: type == 1 || type == 3 ? tableBox + 'px' : '',
      }"
    >
      <div class="table-operator" v-if="$slots.operBtns">
        <slot name="operBtns"></slot>
      </div>

      <div class="iTableBox">
        <!-- 数据为空时提示为暂无数据中文 -->
        <a-config-provider :locale="zhCN">
          <!-- <template #renderEmpty>
            <div style="text-align: center">
              <a-empty :image="simpleImage">
                <span slot="description">暂无数据</span>
              </a-empty>
            </div>
          </template> -->
          <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="showPagination ? pagination : false"
            @change="onPaginChange"
            :defaultExpandAllRows="isExpand"
            :rowSelection="rowSelection"
            :scroll="{
              x: !columnsWidth ? 'max-content' : columnsWidth,
              y: params.pageSize >= 20 ? tableHeight.y : '',
            }"
            :expandRowByClick="isExpandRow"
          >
            <!-- 用于显示索引菜单配置页面有数据模板  -->
            <!-- <template slot="indexSort" slot-scope="text, record, index"> -->
            <!-- <template v-slot:indexSort="text, record, index">  这是最新的写法，上面是老式写法   -->
            <!-- 下面这个是上面的简化写法 -->
            <template #indexSort="text, record, index">
              <!-- <slot name="indexSort">{{ index }}</slot> -->
              <slot name="indexSort" v-bind="{ record, index }">{{
                index
              }}</slot>
            </template>
            <template
              v-for="item in tableSlots"
              v-slot:[item.scopedSlots.customRender]="record"
            >
              <slot
                :name="item.scopedSlots.customRender"
                v-bind="record"
              ></slot>
              <!-- <slot :name="item.scopedSlots.customRender" :t="record"></slot>   在父组件里用时，就要用record.t了，父组件的record可以用其他名称 -->
            </template>

            <!-- 用于鼠标移在表格表头的交互，运力数据有数据模板 -->
            <template v-for="col in tableSlots2" :slot="col.slots.title">
              <!-- <template v-for="col in tableSlots2" v-slot:[col.slots.title]> -->
              <span style="cursor: pointer" :key="col.slots.title">
                <a-tooltip
                  placement="topLeft"
                  :title="col.promptText"
                  arrow-point-at-center
                >
                  {{ col.titleName }}
                </a-tooltip>
              </span>
            </template>
          </a-table>
        </a-config-provider>
      </div>
    </div>
  </div>
</template>
<script>
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
// import { apiDicMixin } from '@/common/mixins';

export default {
  // mixins: [apiDicMixin],
  inject: ['stopClick', 'reload'],
  name: '',
  props: {
    /**列表宽度 */
    columnsWidth: {
      type: Number,
      default: 0,
    },
    /** 列表类型 0. 普通 1. min 型2. 复杂型 */
    type: {
      type: Number,
      default: 0,
    },
    //是否通过点击行来展开子行
    isExpandRow: {
      type: Boolean,
      dafault: () => true,
      require: false,
    },
    searchs: {
      type: Array,
      default: () => [],
      require: false,
    },
    columns: {
      type: Array,
      default: () => [],
      require: true,
    },
    actionArr: {
      type: Array,
      default: () => [],
      require: true,
    },
    sourceData: {
      type: Array,
      default: () => [],
      require: true,
    },
    loadData: {
      type: Function,
      default: () => { },
      require: true,
    },
    // 查询参数
    params: {
      type: Object,
      default: () => {
        return {
          pageSize: 10,
          currentPage: 1,
        };
      },
      require: false,
    },
    isDefault: {
      type: Boolean,
      dafault: () => true,
      require: false,
    },
    isMethod: {
      type: Boolean,
      dafault: () => true,
      require: false,
    },
    isExpand: {
      type: Boolean,
      default: true,
      require: false,
    },
    showPagination: {
      type: Boolean,
      default: true,
      require: false,
    },
    rowSelection: {
      type: Object,
      default: () => { },
      require: false,
    },
    tableHeight: {
      type: Object,
      default: () => {
        return {
          y: document.body.clientHeight - 400,
        };
      },
      require: false,
    },
    disabledDate: {
      type: Function,
      default: () => { },
    },
    //搜索中的注释
    tips: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      zhCN,
      locale,
      tableLocale: { emptyText: '暂无数据' },
      rangeTime: null,
      //expand: false,
      expand: this.searchs.length > 12 ? true : false,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      tableData: [],
      total: 0,
      current: 1,
      pagination: {
        total: 0,
        current: 1,
        pageSize: this.params.pageSize, // 每页中显示10条数据
        // showSizeChanger: true,
        // pageSizeOptions: ['10', '20', '50', '100'], // 每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, // 分页中显示总的数据
      },
      searchOpts: [],
      types: [],
      // isExpand: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        // md: { span: 8 },
        // lg: { span: 8 },
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 8 },
        //md: { span: 8 },
        //lg: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        //md: { span: 8 },
        //lg: { span: 16 },
      },
      selectedRowKeys: [],
      tableBox: null,
    };
  },
  mounted() {
    this.refresh();
    this.getMinHeight();
    this.columns[0].fixed = 'left';
    if (
      this.columns[this.columns.length - 1].scopedSlots &&
      this.columns[this.columns.length - 1].scopedSlots.customRender === 'action'
    ) {
      this.columns[this.columns.length - 1].fixed = 'right';
    }
  },

  watch: {},
  computed: {
    tableSlots() {
      return this.columns.filter(
        (item) =>
          item.scopedSlots &&
          item.scopedSlots.customRender &&
          item.scopedSlots.customRender !== 'indexSort',
      );
    },
    tableSlots2() {
      return this.columns.filter((item) => item.slots && item.slots.title);
    },
    count() {
      return this.expand ? 12 : this.searchs.length;
    },
    searchCol() {
      return {
        md: this.type === 1 ? 18 : 20,
        sm: 24,
      };
    },
    itemCol() {
      return {
        //md: this.type === 1 ? 18 : 6,
        md: 6,
        sm: 24,
      };
    },
    itemCol1() {
      return {
        //md: this.type === 1 ? 18 : 8,
        md: 6,
        sm: 24,
      };
    },
    searchBtns() {
      return {
        //md: this.type === 1 ? 6 : 4,
        md: 24,
        sm: 24,
      };
    },
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.indexOf(input) >= 0
      );
    },

    cityChange(e, v) {
      if (!e.length) {
        // this.params[v.dataIndex] = null;
        this.$set(this.params, v.dataIndex, null);
      }
    },
    // 初始化处理城市级联数据
    getSysRegionListByPidAndLevelDo() {
      const data = {
        level: 1,
        pid: 0,
      };
      getSysRegionListByPidAndLevel({ data })
        .then((res) => {
          if (res.data.code === 0) {
            const array = [];
            res.data.data.map((item) => {
              // level是层级，1代表省份
              array.push(Object.assign(item, { isLeaf: !(item.level === 1) }));
            });
            this.searchs.forEach((e, i) => {
              if (e.type === 'area') {
                this.searchs[i].options = array;
              }
            });
          } else {
            this.$message.error(res.data.message);
          }
          return res;
        })
        .catch(() => { });
    },
    // 省市级联加载数据（第一次选择更改时会触发此函数，已加载过的不会再次触发）
    loadCityData(selectedOptions, i) {
      // console.log(selectedOptions, i);
      const targetOption = selectedOptions[selectedOptions.length - 1];
      // 加载标识
      targetOption.loading = true;
      // console.log('selectedOptions', selectedOptions);
      //console.log('targetOption', targetOption);
      // 选择省份、城市时获取下级数据

      this.doLoadCityData(targetOption.id, targetOption.level, (array) => {
        //console.log('...targetOption111111111', targetOption);
        // 取消加载标识
        targetOption.loading = false;
        // 把下级数据存进去
        targetOption.children = array;
        // 重新赋值级联数据
        this.searchs[i].options = [...this.searchs[i].options];
      });
    },

    // 处理加载城市下级数据（选择、编辑时可用）
    doLoadCityData(id, plevel, callback = null) {
      const data = {
        level: plevel + 1,
        pid: id,
      };
      getSysRegionListByPidAndLevel({ data })
        .then((res) => {
          if (res.data.code === 0) {
            const array = [];
            res.data.data.map((item) => {
              if (
                item.cityCode === '010' ||
                item.cityCode === '022' ||
                item.cityCode === '021' ||
                item.cityCode === '023'
              ) {
                // level是层级，1代表省份
                array.push(Object.assign(item, { isLeaf: item.level === 3 }));
              } else {
                array.push(Object.assign(item, { isLeaf: item.level === 2 }));
              }
            });
            // 再传给回调函数
            if (callback) {
              callback(array);
            }
          } else {
            this.$message.error(res.data.message);
          }
          return res;
        })
        .catch(() => { });
    },
    // 获取字典
    getDic() {
      return op_base_getDic_get();
    },
    // getDicArr() {
    //   return api.op_base_getDic_get();
    // },
    // 选不中时，强制更新
    ChangeSelect() {
      this.$forceUpdate();
    },
    //需要联动的下拉框
    ChangeLinkage(e, change) {
      this.$forceUpdate();
      this.$emit('selectChange', e, change)
    },
    // 监听窗口大小
    // onresize() {
    //   return (() => {
    //     this.screenHeight = this.$refs.element.offsetHeight;
    //   })();
    // },

    // 获取中间部分的高并计算tableBox的高
    getMinHeight() {
      const MineHeight = localStorage.getItem('contentHeight');
      const searchbox = this.$refs.searchbox?.offsetHeight;
      this.tableBox = MineHeight - searchbox - 55;
    },

    moment,
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getQueryParams(param) {
      const params = param;
      this.searchs.forEach((item) => {
        if (!Array.isArray(item.dataIndex)) {
          if (item.data === -1) {
            item.data = null;
          }
          params[item.dataIndex] = item.data || item.data >= 0 ? item.data : null; // item.data || null;
          if (item.type === 'area' && params[item.dataIndex] && !params[item.dataIndex].length) {
            params[item.dataIndex] = null;
          } else if (item.type === 'area' && params[item.dataIndex]) {
            params[item.dataIndex] =
              params[item.dataIndex].length >= 2
                ? item.data[params[item.dataIndex].length - 1]
                : null;
          }
          if (item.type === 'selectAll') {
            if (item.data && item.data.length) {
              params[item.dataIndex] = item.data.toString();
            } else {
              params[item.dataIndex] = null;
            }
          }
          if (item.type === 'monthTime') {
            if (item.data) {
              params[item.dataIndex] = moment(item.data).format('YYYY-MM')
            } else {
              params[item.dataIndex] = null;
            }
          }
          if (item.type === 'date-one') {
            if (item.data) {
              params[item.dataIndex] = moment(item.data).format('YYYY-MM-DD')
            } else {
              params[item.dataIndex] = null;
            }
          }
          if (item.type === 'time') {
            if (item.data) {
              params[item.dataIndex] = moment(item.data).format('HH:mm:ss')
            } else {
              params[item.dataIndex] = null;
            }
          }
        }
        if (Array.isArray(item.dataIndex)) {
          if (item.format) {
            params[item.dataIndex[0]] =
              item.rangeTime && item.rangeTime.length > 0
                ? moment(item.rangeTime[0]).format('YYYY-MM-DD')
                : null;
            params[item.dataIndex[1]] =
              item.rangeTime && item.rangeTime.length > 0
                ? moment(item.rangeTime[1]).format('YYYY-MM-DD')
                : null;
          } else {
            params[item.dataIndex[0]] =
              item.rangeTime && item.rangeTime.length > 0
                ? moment(item.rangeTime[0]).format('YYYY-MM-DD HH:mm:ss')
                : null;
            params[item.dataIndex[1]] =
              item.rangeTime && item.rangeTime.length > 0
                ? moment(item.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss')
                : null;
          }
        }
      });
    },
    // 刷新
    refresh(e) {
      const { params } = this;
      this.getQueryParams(params);
      console.log(params)
      return this.loadData(params)
        .then((res) => {
          let count = 1;
          if (res.data.code === 0) {
            const data =
              res.data.data &&
              res.data.data.map((item) => {
                if (item.id) {
                  item.key = item.id;
                } else {
                  item.key = count;
                }
                count += 1;
                return item;
              });
            if (!this.isDefault) {
              this.tableData = this.sourceData;
              //this.isExpand = true;
            } else {
              this.tableData = data;
            }
          } else {
            this.tableData = [];
            this.$message.error(res.data.message);
          }
          this.total = res.data.total || 0;
          this.pagination.total = res.data.total || 0;
          return res
        })
        .catch((err) => {
          this.$store.state.loading = false;
          console.log(err);
        });
    },
    // 分页切换
    onPaginChange(pagination, filters, sorter) {
      // this.current = pagination.current;
      //this.refresh();
      this.stopClick(false, 1100, `请等待1s后再次点击`).then(() => {
        this.pagination.current = pagination.current;
        this.params.currentPage = pagination.current;
        this.params.sortWith = sorter.field
        this.params.sortType = sorter.order ? sorter.order.replace(/end/g, '') : ''
        this.refresh();
      });
    },
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.params.currentPage = 1;
      this.pagination.current = 1;
      this.stopClick(false).then(() => {
        this.refresh();
      });
    },
    // 重置
    reset() {
      if (this.searchs.length > 0) {
        this.searchs.forEach((item) => {
          if (item.type === 'select' || item.type === 'selectSearch' || item.type === 'selectChange') {
            if (item.isChange) {//重置后默认第一个
              item.data = item.options[0].value
            } else {
              item.data = undefined;
            }
          } else if (item.type === 'selectAll') {
            item.data = [];
          } else {
            item.data = null;
          }
          if (item.rangeTime) {
            if (!this.isMethod) {
              item.rangeTime = null;
            } else {//结算日数据重置的时候日期不重置
              if (this.$route.query.date) {
                item.rangeTime = [moment(this.$route.query.date).startOf(item.dateType), moment(this.$route.query.date).endOf(item.dateType)]
              } else {
                item.rangeTime = [moment().startOf(item.dateType), moment().endOf(item.dateType)]
              }
            }
          }
        });
      }
      this.params.currentPage = 1;
      this.pagination.current = 1;
      this.stopClick(false).then(() => {
        this.refresh();
      });
      this.$emit('selectChange')
    },
    // 展开/收起
    toggle() {
      this.expand = !this.expand;
    },
    // // 选择框切换
    handleChange(value) {
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss" scoped>
//无数据时也显示滚动条
::v-deep .ant-table-placeholder {
  padding: 0;
  border-top: none;
}
.mainbox {
  display: flex;
  flex-direction: column;
  height: 99%;
}
.form-box {
  padding: 10px;
  // border: 1px solid #d9d9d9;
  border-radius: 6px;
  // padding-bottom: 0;
  // margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.table-box {
  background-color: #fff;
  border-radius: 6px;
  // min-height: calc(100% - 80px);
  padding: 10px;
  flex: auto;
  overflow: auto;
}
.search-box {
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 10px;
}

.page {
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}
.btns {
  margin-top: 15px;
}
.table-operator {
  margin-bottom: 10px;
}
</style>
<style>
.ant-advanced-search-form .ant-form-item {
  display: flex !important;
  margin-bottom: 0 !important;
  justify-content: flex-end !important;
}
a {
  color: #294deb;
}
.ant-advanced-search-form {
  flex: 1 !important;
}
.ant-table-thead > tr > th {
  background: #ecebeb !important;
  text-align: center;
  padding: 10px 16px !important;
  color: #666;
}
.ant-table-tbody > tr > td {
  padding: 4px 16px !important;
  color: #000;
}
.ant-tabs {
  overflow: auto;
}
.ant-form-explain,
.ant-btn,
.ant-form label,
.ant-input,
.ant-tabs-nav-container,
.ant-checkbox-wrapper,
.ant-form-item,
.ant-form,
.ant-select,
.ant-modal-body,
.ant-descriptions-item-content,
.ant-descriptions-item-label,
.ant-table,
.ant-card,
.ant-input-number {
  font-size: 12px !important;
}
.ant-descriptions-title {
  font-size: 14px;
}
.ant-btn,
.ant-btn:hover,
.ant-btn:focus {
  color: #294deb;
  border-color: #294deb;
  margin-right: 5px;
}
.ant-btn-link {
  color: #294deb;
}
.ant-btn-link:hover,
.ant-btn-link:focus {
  color: #294deb;
  /* border: 0px; */
}
.ant-btn-primary {
  background-color: #294deb;
  border-color: #294deb;
}
.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: #294deb;
  border-color: #294deb;
  color: #fff;
}
.ant-pagination-item-active a {
  color: #294deb;
}
.ant-pagination-item-active {
  border-color: #294deb;
}

.ant-pagination-item:hover a {
  color: #294deb;
  border-color: #294deb;
}
.ant-pagination-item:hover {
  color: #294deb;
  border-color: #294deb;
}
.ant-pagination-prev:hover .ant-pagination-item-link:hover,
.ant-pagination-next:hover .ant-pagination-item-link:hover {
  color: #294deb;
  border-color: #294deb;
}
.ant-pagination-item:focus a {
  color: #294deb;
  border-color: #294deb;
}
.ant-pagination-item:focus {
  color: #294deb;
  border-color: #294deb;
}
.ant-pagination-prev:focus .ant-pagination-item-link:focus,
.ant-pagination-next:focus .ant-pagination-item-link:focus {
  color: #294deb;
  border-color: #294deb;
}
/* .ant-table-wrapper {
  height: 730px;
}

.ant-table-placeholder {
  height: 680px;
} */
.ant-table-pagination.ant-pagination {
  margin-top: 30px;
  margin-right: 20px;
  margin-bottom: 0;
}
.ant-col.ant-col-20 {
  padding-bottom: 10px !important;
}
.ant-table-pagination.ant-pagination {
  margin-top: 10px !important;
}
::-webkit-scrollbar {
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #cdcdcd;
  border-radius: 10px;
}
/*滑道*/
::-webkit-scrollbar-track {
  background-color: #f0f0f0;
  border-radius: 10px;
}
</style>
