import dict from '../utils/util.dicts'

export default {
  inject: ['d2CrudContext'],
  props: {
    // 数据字典配置
    // {url:'xxx',data:[],value:'',label:'',children:''}
    dict: {
      type: Object,
      require: false,
      default: () => {
        return { data: undefined }
      }
    },
    // 选项列表，优先级比dict高
    options: {
      type: Array,
      require: false
    },
    // 字典数据ready
    onReady: {
      type: Function,
      require: false
    }
  },
  data () {
    return {
      dictOptions: undefined
    }
  },
  mounted () {
    if (this.dict) {
      dict.mergeDefault(this.dict)
      if (this.dict.immediate !== false) {
        this.loadDict()
      }
    }
  },
  computed: {
    _options () {
      if (this.options != null) {
        return this.options
      }
      if (this.dictOptions != null) {
        return this.dictOptions
      }
      return []
    }
  },
  watch: {
    'dict.url': function (value, oldValue) {
      if (this.dict) {
        this.dict.data = undefined
        this.dict.dataMap = undefined
        this.dictOptions = undefined
        // 清空可选项
        if (this.dict.url) {
          // 重新加载
          this.loadDict()
        }
      }
    }
  },
  methods: {
    clearDict () {
      this.dict.data = undefined
      this.dict.dataMap = undefined
      this.dictOptions = undefined
    },
    reloadDict () {
      this.clearDict()
      // 清空可选项
      if (this.dict.url) {
        // 重新加载
        this.loadDict()
      }
    },
    getDictData () {
      return this.dictOptions
    },
    loadDict () {
      const options = { component: this }
      if (this.d2CrudContext) {
        options.form = this.d2CrudContext.getForm()
      }
      console.log('context--------------', this.d2CrudContext, options)
      dict.get(this.dict, options).then((data) => {
        this.$set(this, 'dictOptions', data)
        if (this.onReady != null) {
          this.onReady(this)
        }
      })
    }
  }
}
