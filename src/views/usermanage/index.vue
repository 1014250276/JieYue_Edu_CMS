<template>
<!-- 人员列表 -->
  <div id="container">
    <el-card class="box-card">
      <div class="btn_group">
        <el-row>
           <el-button type="danger">删除</el-button>
          <el-button type="primary" @click="handleCreate">添加</el-button>
        </el-row>
      </div>

      <div class="table_box">
            <el-table
                ref="multipleTable"
                 @selection-change="handleSelectionChange"
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                 <el-table-column
                  fixed
                  prop="id"
                  label="ID"
                  sortable
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="cover"
                  label="头像"
                  min-width="80">
                    <template slot-scope="scope">
                      <span>{{scope.row.cover | coverfittler}}</span>
                      <!-- <img :src=scope.row.cover alt=""> -->
                    </template>
                </el-table-column>
                <el-table-column
                  fixed
                  prop="name"
                  label="名字"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="position"
                  label="职务"
                  min-width="150">
                    <template slot-scope="scope">
                      <span>{{scope.row.position | positionfittler}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                  fixed
                  prop="type"
                  label="类型"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="status"
                  label="状态"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="address"
                  label="地址"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="salary"
                  label="薪资"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="scope"
                  label="涨幅"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="desc"
                  label="简介"
                  min-width="200">
                   <template slot-scope="scope">
                      <span>{{scope.row.desc | descfittler}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                  fixed
                  prop="created_at"
                  label="创建时间"
                  min-width="100">
                   <template slot-scope="scope">
                      <span>{{scope.row.created_at | timefittler}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                  fixed
                  prop="updated_at"
                  label="更新时间"
                  min-width="100">
                  <template slot-scope="scope">
                      <span>{{scope.row.updated_at | timefittler}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                    <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                    <el-button  @click="handleEditClick(scope.row)" type="primary" size="small">编辑</el-button>
                    <el-button  @click="handleDelClick(scope.row)" type="danger" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            
            <!-- 分页器 -->
            <div class="page_box">
                 <div class="block">
                  <!-- <span class="demonstration">完整功能</span> -->
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="100">
                  </el-pagination>
                </div>
            </div>

            <!-- dialog -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
              <el-form-item label="Type" prop="type">
                <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
              <el-form-item label="Date" prop="timestamp">
                <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
              </el-form-item>
              <el-form-item label="Title" prop="title">
                <el-input v-model="temp.title" />
              </el-form-item>
              <el-form-item label="Status">
                <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="Imp">
                <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
              </el-form-item>
              <el-form-item label="Remark">
                <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                确认
              </el-button>
            </div>
          </el-dialog>

      </div>

    </el-card>
  </div>
</template>

<script>

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
    name:'',
    data(){
      return {
        tableData: [
        {
        "id":4,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640843532_pSA2utSqvb.png",
        "name":"Pack老师",
        "position":"企业创始人",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星教育创始人，12年项目研发经验，曾就职于IBM、拓维等上市公司担任架构师/开发主管等职位；熟悉PHP开源系统的二次开发；大容量高并发电商应用架构设计和开发经验；专注于大数据WEB架构；有Hadoop大数据云平台平台项目架构经验；丰富的企业专业培训经验。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 13:54:22",
        "updated_at":"2021-12-30 13:54:22"
        },
        {
        "id":5,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640843677_GSDELGI2AI.png",
        "name":"Peter老师",
        "position":"六星集团联合创始人、PHP学院院长、资深架构师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"9年项目研发经验，担任过拓维、新浪等上市企业技术管理岗位，经历过大型项目的攻坚与调优。擅长领域：接口服务设计，微服务架构、swoole网络编程、机器学习，熟悉Laravel等框架的优化；对大数据业务、高并发数据优化拥有丰富经验。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 13:55:13",
        "updated_at":"2021-12-30 13:55:13"
        },
        {
        "id":6,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640843727_14aCPnr2Q4.png",
        "name":"Helen老师",
        "position":"Python学院教学研发总监",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星教育Python学院教学研发总监，毕业于中南大学计算机专业，曾在百度担任架构师是学员心中的代码女神同时也是敢想敢做的女汉子!!!",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 13:55:51",
        "updated_at":"2021-12-30 13:55:51"
        },
        {
        "id":7,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640843761_qnD4dNzRtd.png",
        "name":"新雨老师",
        "position":"C++学院项目总监、高级架构师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星教育项目研发部技术总监，资深架构师，擅长领域Python爬虫-数据分析、PHP、webJavaScript，7年大型电商平台架构经验,曾就职于牙医帮电商平台、亚信、阿里云IoT事业部。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 13:56:25",
        "updated_at":"2021-12-30 13:56:25"
        },
        {
        "id":8,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640843998_TnSq6yVaAb.png",
        "name":"Luke老师",
        "position":"PHP学院金牌讲师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星教育php学院金牌讲师，6年项目研发经验，曾任职于奇虎360 虎牙等公司。精通php主流框架、性能优化、接口开发、拥有大型网站设计和开发经验。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 13:57:34",
        "updated_at":"2021-12-30 14:00:00"
        },
        {
        "id":9,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844103_zzuYVtS3v1.png",
        "name":"Winner老师",
        "position":"研发经理、金牌高级讲师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"已有7年PHP项目开发经验，曾任职于腾讯、亚信等大型互联网公司。精通各种PHP主流框架技术、熟悉网站架构设计和API接口性能调优等。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:02:02",
        "updated_at":"2021-12-30 14:02:02"
        },
        {
        "id":10,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844136_40Y6lGwfzc.png",
        "name":"Zero老师",
        "position":"架构师、项目负责人",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"八年一线互联网公司工作经验，之前就职于金蝶、中兴等知名互联网公司，前金蝶中间件团队架构组成员、中兴通讯项目负责人，负责主导过多个大型互联网项目研发到落地部署，专注于并发/网络编程、微服务/分布式架构、高并发/高性能/高可用等技术领域。对JVM、JUC、Microservices等技术有深入研究，追求“三高”系统架构设计。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:02:45",
        "updated_at":"2021-12-30 14:02:45"
        },
        {
        "id":11,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844183_GqBl5xbUgW.png",
        "name":"教主老师",
        "position":"C/C++金牌讲师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"2年线下教育经验，熟知小白如何入门经验。3年北上广cocos2d游戏开发经验。精通C/C++编程语言，数据结构和高级算法，Lua语言，熟练掌握cocos2d游戏引擎研发，unity3d游戏引擎编程。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:03:28",
        "updated_at":"2021-12-30 14:03:28"
        },
        {
        "id":12,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844216_htBGIRGax6.png",
        "name":"楚墨老师",
        "position":"杰越学院院长",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星教育-杰越学院院长兼联合创始人、腾讯课堂认证讲师、15-16年腾讯游戏美术指导、深圳设计艺术协会品牌设计指导。教学经验丰富，2017年开始受各大设计平台邀请分享，研发设计资料100+套，辅导教学1000+正式学员，众多学员就业于国内外各大品牌设计平台。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:03:51",
        "updated_at":"2021-12-30 14:03:51"
        },
        {
        "id":13,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844242_L7LV6owz9q.png",
        "name":"龙卷风老师",
        "position":"C/C++金牌讲师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"多年在线授课经验,擅长c/c++、Win32MFC编程、Qt编程、逆向工程、曾担任某大型互联网公司项目组长、讲课风趣幽默，受广大学员喜爱。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:04:18",
        "updated_at":"2021-12-30 14:04:18"
        },
        {
        "id":14,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844268_a3CxfHO3mi.png",
        "name":"北斗老师",
        "position":"Java学院院长、高级架构师",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"Java 10年开发经验，六星教育Java学院院长，擅长分布式架构集群搭建优化，架构拆分。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:04:47",
        "updated_at":"2021-12-30 14:04:47"
        },
        {
        "id":15,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844297_046SNY2WAH.png",
        "name":"晴天老师",
        "position":"六星软件学院CTO",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星软件学院CTO，曾任职于省六建、阿里云IOT事业部，9年项目开发经验，高级全栈开发工程师，精通Django Flask 开发框架，精通Matplotlib Numpy Pandas 数据分析。",
        "status":0,
        "type":1,
        "created_at":"2021-12-30 14:05:12",
        "updated_at":"2021-12-30 14:05:12"
        },
        {
        "id":16,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844501_jRzxEmFdt1.jpg",
        "name":"Pack老师",
        "position":"六星创始人",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"7年线上教学管理经验，曾就职于IBM、拓维等上市公司担任架构师职位； 技术精湛，13年项目架构架构经验，高级架构师，知识面涉猎广泛，精通PHP、python、java等多种编程语言，主导过亿级电商平台，大型国企云平台，工业互联网平台等; 优秀企业家，担任湖南电子科技职业学院、湖南工程学院、湖南大学等高校创新创业指导导师，具备丰富的企业专业培训经验和在线授课经验； 自2014年开始进入在线教育领域创业，升级公开课直播授课模式，凭借7年以上在线授课和丰富的企业管理经验，独创10s课程教学服务体系以及在线讲师培养体系。",
        "status":0,
        "type":3,
        "created_at":"2021-12-30 14:08:43",
        "updated_at":"2021-12-30 14:08:43"
        },
        {
        "id":17,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844564_PPL80NbEeZ.jpg",
        "name":"Peter老师",
        "position":"合伙人",
        "address":"",
        "salary":"",
        "scope":"",
        "desc":"六星PHP学院院长、六星教育合伙人，9年PHP研发经验，曾就职于拓维、新浪等上市公司，经历过大型项目的攻坚与调优； 擅长领域：接口服务设计，微服务架构、swoole网络编程、机器学习，熟悉Laravel等框架的优化； 对大数据业务、高并发数据优化拥有丰富的经验。",
        "status":0,
        "type":3,
        "created_at":"2021-12-30 14:09:38",
        "updated_at":"2021-12-30 14:09:38"
        },
        {
        "id":18,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844618_wzOAjH4QYL.png",
        "name":"陈*华",
        "position":"Python高级开发",
        "address":"北京 ",
        "salary":"25K",
        "scope":"涨幅25%",
        "desc":"师上课生动有趣,逻辑清楚，尤其是现场敲代码，行云流水，给我们一种摸得到，学得到的感觉，单元讲完之后，还会给我们进行系统的总结和面试参考题，对我们面试有很大帮助。<br/></br> 学过：Python全栈+爬虫+AI人工智能-挑战年薪30万",
        "status":0,
        "type":2,
        "created_at":"2021-12-30 14:11:16",
        "updated_at":"2021-12-31 09:55:03"
        },
        {
        "id":19,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844711_V1o30kOKi7.png",
        "name":"渠*峰",
        "position":"PHP高级工程师",
        "address":"深圳",
        "salary":"22K",
        "scope":"涨幅80%",
        "desc":"干了5年多的码农，希望自己能接触更高的技术和知识面,苦于工作中接触不到，偶然的机会听了Pack老师的课程后决定跟着学习。学到了高并发等项目架构，我相信我离架构师的距离又进了一步了，我会跟着六星教育一起成长进步！</br></br>学过：PHP高级开发—大神开发专题课程",
        "status":0,
        "type":2,
        "created_at":"2021-12-30 14:12:29",
        "updated_at":"2021-12-30 14:12:29"
        },
        {
        "id":20,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844763_Bq7vSRo6kE.png",
        "name":"黄*茂",
        "position":"PHP高级开发",
        "address":"上海",
        "salary":"16K",
        "scope":"涨幅60%",
        "desc":"我从事PHP开发1年多，工作一般是CURD，解决问题的能力比较差，直到跟着Peter老师学习后我提升特别大。 讲课思路清晰，课程体系由浅入深，重点是教会学员们思路和解决问题的方法。 工作中处理问题的思路变得清晰了，感谢六星，感谢老师们一直在后面的辛苦付出，让我们学到了扎实的技术！</br></br>学过：PHP企业级开发-零基础高薪就业课程",
        "status":0,
        "type":2,
        "created_at":"2021-12-30 14:13:27",
        "updated_at":"2021-12-30 14:13:27"
        },
        {
        "id":21,
        "cover":"http://172.16.13.2:8800/uplode/img/202112/30/1640844818_zirM1eGeqt.png",
        "name":"朱*聪",
        "position":"Java架构师",
        "address":"北京",
        "salary":"32K",
        "scope":"涨幅30%",
        "desc":"作为一名初级的Java架构师，工作中爬坑不断，由于自己个人能力欠缺经常头大害怕看到下属们质疑的目光。我特别渴望在碰到难题时能有大牛指点一二，让自己的思路能豁然开朗。跟着学习了Java架构班后觉得自己的思维更严谨更开阔了。工作时遇到难题也能得到及时的点拨，让自己少走了很多弯路。</br></br>学过：Java高级架构师进阶课程",
        "status":0,
        "type":2,
        "created_at":"2021-12-30 14:14:49",
        "updated_at":"2021-12-30 14:14:49"
        }
        ],
        multipleSelection:[],//多选框值
        
        currentPage: 1,//当前页码

        calendarTypeOptions,
        statusOptions: ['published', 'draft', 'deleted'],
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
      }
    },
    //过滤器
    filters:{
      //图片超出过滤
      coverfittler(value){
          if (!value) return "";
          if (value.length > 8) {
          return value.slice(0, 8) + "...";
          }
          return value;
      },
      //职务部分超出过滤
      positionfittler(value){
         if (!value) return "";
          if (value.length > 8) {
          return value.slice(0, 8) + "...";
          }
          return value;
      },
      //简介部分超出过滤
      descfittler(value){
        if (!value) return "";
          if (value.length > 12) {
          return value.slice(0, 12) + "...";
          }
          return value;
      },
      //时间部分超出过滤
      timefittler(value){
        if (!value) return "";
          if (value.length > 10) {
          return value.slice(0, 10) + "...";
          }
          return value;
      }
    },
    methods:{
      //重置表单信息
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      //表单新增
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      //table编辑
      handleEditClick(row) {
          console.log(`编辑${row}`);
          this.temp = Object.assign({}, row) // copy obj
          this.temp.timestamp = new Date(this.temp.timestamp)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
      },
      //table删除
      handleDelClick(row) {
           console.log(`删除${row}`);
           this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //删除成功后，重置表单
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
      },
      //多选框值变化
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      
      handleSizeChange(){},

      handleCurrentChange(){},
    }
}
</script>

<style  scoped>
#container{
  padding:0;
  margin:0 auto；
  
}
.btn_box{
  margin: 20px auto;
}
.table_box{
  margin: 20px auto;
}

.page_box{
  width:100%;
  margin:10px auto;
}
</style>

