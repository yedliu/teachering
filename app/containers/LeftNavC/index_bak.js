 /*
 *
 * LeftNavC 请在routeMap里面加
 *
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {  FlexCenter, FlexColumn } from 'components/FlexBox';
import LoadingIndicator from 'components/LoadingIndicator';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import { Menu, Icon } from 'antd';
import immutable, { fromJS } from 'immutable';
import AppLocalStorage from 'utils/localStorage';
import Alert from 'components/Alert';
import {
  getLessonTypeAction,
  getGradeAction,
  getSubjectAction,
  changeAlertShowOrHideAction,
  setAlertStatesAction,
  changeBackPromptAlertShowAction
} from './actions';
import makeSelectLeftNavC, {
  makeAlertShowOrHide,
  makeAlertStates,
  makeBackPromptAlertShow,
  makebackAlertStates
} from './selectors';
import { setPageState } from 'containers/QuestionManagement/actions';

const BodyWrapper = styled(FlexColumn)`
  width: 230px;
  // height: 100%;
  background-color: white;
  position: relative;
  z-index: 1;
  font-size: 14px;
  overflow-y:auto;
  flex-shrink:0;
  * {
    user-select: none;
  }
`;
const ChildWrapper = styled.div`
  font-size: 14px;
  & > p {
    line-height: 2em !important;
  }
`;

const ToggleBtn = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  width: 40px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  z-index: 111;
  color: #ffffff;
  text-align: center;
  background: #3e4753;
`;

// const HomeItem = styled(FlexRowCenter) `
//   min-height: 60px;
//   width: 100%;
//   cursor: pointer;
//   font-size: 14px;
//   padding-left: 88px;
//   background: url('${homeImg}') no-repeat 38px center;
// `;

export class LeftNavC extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleOnclick = this.handleOnclick.bind(this);
    this.state = {
      openKeys: sessionStorage.getItem('menuKeys') && [JSON.parse(sessionStorage.getItem('menuKeys'))[1]] || [],
      selectedKeys: sessionStorage.getItem('menuKeys') && [JSON.parse(sessionStorage.getItem('menuKeys'))[0]] || [],
    };
  }
  componentDidMount() {
    this.props.dispatch(getSubjectAction());
    this.props.dispatch(getGradeAction());
    this.props.dispatch(getLessonTypeAction());
  }
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys: openKeys,
    });
  }
  handleOnclick = (v) => {
    console.log(v);
    sessionStorage.setItem('menuKeys', JSON.stringify(v.keyPath));
    this.setState({
      openKeys: [v.keyPath[1]] || [],
      selectedKeys: [v.keyPath[0]] || [],
    });
    // 匹配zml编辑器相关路由跳转 路径以 /h5/ 开始作为判断标示，新路由跳至 /zmlEditor/
    if (window.openMapRoutesH5) {
      const H5Route = v.key.indexOf('/h5/') === 0;
      const H5Path = location.pathname.indexOf('/zmlEditor/') === 0;
      // 新项目，匹配路由切换到新路由
      if (H5Path && H5Route) {
        browserHistory.push(v.key.replace('/h5/', '/zmlEditor/'));
        return;
      }
      // 老项目，匹配路由跳转新项目
      if (!H5Path && H5Route) {
        location.href = v.key.replace('/h5/', '/zmlEditor/');
        return;
      }
      // 新项目，不匹配路由跳回老项目
      if (H5Path && !H5Route) {
        location.href = v.key;
        return;
      }
    }
    // 匹配zml编辑器相关路由跳转结束
    if (v.key === '/tr/questionmanagement') {
      this.props.dispatch(setPageState('isGroup', false));
    }
    browserHistory.push(v.key);
  };
  checkPermission(e, all) {
    const permissions = AppLocalStorage.getPermissions();
    let bool = false;
    if (all) {
      bool = e.every((it) => permissions.indexOf(it) > -1);
    } else {
      bool = e.some((it) => permissions.indexOf(it) > -1);
    }
    return bool;
  }
  // eslint-disable-next-line
  render() {
    const permissions = AppLocalStorage.getPermissions();
    const subItemStyle = {
      width: 230,
      color: '#fff',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 88
    };
    permissions.some(
      (it) => ['qb_upload', 'qb_cut', 'qb_cut_audit', 'qb_entry'].indexOf(it) > -1
    );
    // console.log(paperPer, 'paperPer -- login 59');

    // h5课件部分导航
    const H5CourseMenu = () => {
      // 权限判断
      let auth = this.checkPermission([
        'knowledge_dir_management',
        'slice_management',
        'zml_management',
        'material_dir_management',
        'material_management',
      ],
        false);
      if ((permissions.indexOf('courseware_management') === -1) || !auth) return null;
      return (
        <Menu.SubMenu
          key="sub_h5"
          title={
            <span>
              <Icon type="file" />
              <span>H5课件</span>
            </span>
            }
          style={subItemStyle}
          >
          {
            permissions.indexOf('knowledge_dir_management') !== -1 &&
            <Menu.Item key="/h5/feature-contents" style={{ background: '#3A404D' }}>
              知识元目录管理
            </Menu.Item>
          }
          {
            permissions.indexOf('slice_management') !== -1 &&
            <Menu.Item key="/h5/feature-list" style={{ background: '#3A404D' }}>
              知识元切片管理
            </Menu.Item>
          }
          {
            permissions.indexOf('zml_management') !== -1 &&
            <Menu.Item key="/h5/course-list" style={{ background: '#3A404D' }}>
              课件讲义管理
            </Menu.Item>
          }
          {
            permissions.indexOf('material_dir_management') !== -1 &&
            <Menu.Item key="/h5/course-material" style={{ background: '#3A404D' }}>
              素材库目录管理
            </Menu.Item>
          }
          {
            permissions.indexOf('material_management') !== -1 &&
            <Menu.Item key="/h5/course-material-contents" style={{ background: '#3A404D' }}>
              素材库内容管理
            </Menu.Item>
          }
        </Menu.SubMenu>
      );
    };

    // 切换菜单宽度
    const toggleMenuWidth = (event) => {
      const menuDom = document.querySelector('#bodyMenuLeft');
      const target = event.target;
      if (!menuDom) return;
      const menuWidth = menuDom && parseInt(getComputedStyle(menuDom).width, 10);
      if (menuWidth > 200) {
        menuDom.style.width = '40px';
        target.innerHTML = '+';
        target.style.height = '80%';
      } else {
        menuDom.style.width = '230px';
        target.innerHTML = '-';
        target.style.height = '30px';
      }
    };

    return (
      <BodyWrapper id="bodyMenuLeft">
        <ToggleBtn onClick={toggleMenuWidth}>-</ToggleBtn>
        <Menu
          style={{ width: 230, flex: 1, background: '#3e4753' }}
          mode="inline"
          theme="dark"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          selectedKeys={this.state.selectedKeys}
          onClick={this.handleOnclick}
        >
          <Menu.Item key="/home">
            <Icon type="home" />
            <span>首页</span>
          </Menu.Item>
          {this.checkPermission(
            [
              'edition_data_management',
              'course_system_management',
              'test_lesson_knowledge_management',
              'knowledge_management',
              'exam_point_management',
              'textbook_management'
            ],
            false
          ) ? (
            <Menu.SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>基础数据管理</span>
                </span>
              }
              style={subItemStyle}
            >
              {permissions.indexOf('edition_data_management') > -1 ? (
                <Menu.Item key="/edition" style={{ background: '#3A404D' }}>
                  版本数据管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('textbook_management') > -1 ? (
                <Menu.Item key="/tr/textbook-edition" style={{ background: '#3A404D' }}>
                  教材版本及目录管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('course_system_management') > -1 ? (
                <Menu.Item key="/course-system" style={{ background: '#3A404D' }}>
                  正式课体系管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('test_lesson_knowledge_management') > -1 ? (
                <Menu.Item key="/test-lesson-knowledge" style={{ background: '#3A404D' }}>
                  测评课体系管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('knowledge_management') > -1 ? (
                <Menu.Item key="/knowledge" style={{ background: '#3A404D' }}>
                  知识点管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('exam_point_management') > -1 ? (
                <Menu.Item key="/examination-point" style={{ background: '#3A404D' }}>
                  考点管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('training_material_managerment') > -1 ? (
                <Menu.Item key="/study-system-management" style={{ background: '#3A404D' }}>
                  学习资料体系管理
                </Menu.Item>
              )  : (
                ''
              )}
            </Menu.SubMenu>
          ) : (
            ''
          )}
          {/* {this.checkPermission(['knowledge_management', 'exam_point_management'], false) ? <Menu.SubMenu key="sub2" title={<span><Icon type="database" /><span>题库数据管理</span></span>} style={subItemStyle}> */}
          {/* {permissions.indexOf('knowledge_management') > -1 ? */}
          {/* <Menu.Item key="/knowledge" style={{ background: '#3A404D' }}>知识点管理</Menu.Item> : ''} */}
          {/* {permissions.indexOf('exam_point_management') > -1 ? */}
          {/* <Menu.Item key="/examination-point" style={{ background: '#3A404D' }}>考点管理</Menu.Item> : ''} */}
          {/* </Menu.SubMenu> : ''} */}
          {this.checkPermission(['add_vedio', 'vedio_management'], false) ? (
            <Menu.SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="video-camera" />
                  <span>优秀视频管理</span>
                </span>
              }
              style={subItemStyle}
            >
              {permissions.indexOf('add_vedio') > -1 ? (
                <Menu.Item key="/addvideo" style={{ background: '#3A404D' }}>
                  添加视频
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('vedio_management') > -1 ? (
                <Menu.Item key="/videomanage" style={{ background: '#3A404D' }}>
                  管理视频
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu.SubMenu>
          ) : (
            ''
          )}
          {this.checkPermission(
            [
              'qb_upload',
              'qb_cut',
              'qb_cut_audit',
              'qb_entry',
              'qb_entry_audit',
              'qb_tag',
              'qb_tag_audit'
            ],
            false
          ) ? (
            <Menu.SubMenu
              key="sub4"
              title={
                <span>
                  <Icon type="database" />
                  <span>试题录入</span>
                </span>
              }
              style={subItemStyle}
            >
              {permissions.indexOf('qb_upload') > -1 ? (
                <Menu.Item key="/addPaper" style={{ background: '#3A404D' }}>
                  试卷上传和分发
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('qb_cut') > -1 ? (
                <Menu.Item key="/tr/getandcutpaper" style={{ background: '#3A404D' }}>
                  试卷切割
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('qb_cut_audit') > -1 ? (
                <Menu.Item key="/tr/papercutverify" style={{ background: '#3A404D' }}>
                  试卷切割审核
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('qb_entry') > -1 ? (
                <Menu.Item key="/tr/getandinputpaper" style={{ background: '#3A404D' }}>
                  试卷录入
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('qb_entry_audit') > -1 ? (
                <Menu.Item key="/tr/paperinputverify" style={{ background: '#3A404D' }}>
                  试卷录入审核
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('qb_tag') > -1 ? (
                <Menu.Item key="/tr/settags" style={{ background: '#3A404D' }}>
                  试卷贴标签
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('qb_tag_audit') > -1 ? (
                <Menu.Item key="/tr/tagsverify" style={{ background: '#3A404D' }}>
                  试卷贴标签审核
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('final_audit') > -1 ? (
                <Menu.Item key="/tr/paperfinalverify" style={{ background: '#3A404D' }}>
                  试卷终审
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu.SubMenu>
          ) : (
            ''
          )}
          {this.checkPermission(
            ['question_data_management', 'exam_paper_data_management', 'question_corretion'],
            false
          ) ? (
            <Menu.SubMenu
              key="subextra"
              title={
                <span>
                  <Icon type="aliwangwang-o" />
                  <span>题库管理</span>
                </span>
              }
              style={subItemStyle}
            >
              {permissions.indexOf('question_data_management') > -1 ? (
                <Menu.Item key="/tr/questionmanagement" style={{ background: '#3A404D' }}>
                  已入库题目管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('exam_paper_data_management') > -1 ? (
                <Menu.Item key="/tr/papermanagement" style={{ background: '#3A404D' }}>
                  试卷管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('question_corretion') > -1 ? (
                <Menu.Item key="/tr/errorcorrectmanagement" style={{ background: '#3A404D' }}>
                  题目纠错管理
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu.SubMenu>
          ) : (
            ''
          )}
          {this.checkPermission(['test_lesson_homework_management', 'xue_tang_homework'], false) ? (
            <Menu.SubMenu
              key="sub5"
              title={
                <span>
                  <Icon type="database" />
                  <span>标准作业管理</span>
                </span>
              }
              style={subItemStyle}
            >
              {permissions.indexOf('test_lesson_homework_management') > -1 ? (
                <Menu.Item key="/tr/standhomework" style={{ background: '#3A404D' }}>
                  正式课作业管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('test_lesson_homework_management') > -1 ? (
                <Menu.Item key="/tr/testhomework" style={{ background: '#3A404D' }}>
                  测评课作业管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('xue_tang_homework') > -1 ? (
                <Menu.Item key="/tr/schoolhomework?type=school" style={{ background: '#3A404D' }}>
                  掌门学堂作业管理
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu.SubMenu>
          ) : (
            ''
          )}
          {this.checkPermission(['courseware_management', 'piano_teaching_materials'], false) ? (
            <Menu.SubMenu
              key="sub6"
              title={
                <span>
                  <Icon type="credit-card" />
                  <span>资源管理</span>
                </span>
              }
              style={subItemStyle}
            >
              {permissions.indexOf('courseware_management') > -1 ? (
                <Menu.Item key="/course-manager" style={{ background: '#3A404D' }}>
                  {' '}
                  课件管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('courseware_management') > -1 ? (
                <Menu.Item key="/testlesson-courseware" style={{ background: '#3A404D' }}>
                  {' '}
                  测评课课件管理
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('courseware_management') > -1 ? (
                <Menu.Item key="/tr/conversiondata" style={{ background: '#3A404D' }}>
                  {' '}
                  转化率数据
                </Menu.Item>
              ) : (
                ''
              )}
              {permissions.indexOf('piano_teaching_materials') > -1 ? (
                <Menu.Item key="/tr/pianoteachingcatalogue" style={{ background: '#3A404D' }}>
                  琴谱库管理
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu.SubMenu>
          ) : (
            ''
          )}
          {H5CourseMenu()}
          {this.checkPermission(
            [
              'lecture_course_content_management',
              'lecture_course_system_management',
              'lecutre_courseware_management',
              'lecutre_clazz_standard_homework_management',
              'lecutre_courseware_download_print_delete',
            ],
            false
          ) ? (
            <Menu.SubMenu
              key="sub10"
              title={
                <span>
                  <Icon type="credit-card" />
                  <span>大班课相关</span>
                </span>
                }
              style={subItemStyle}
              >
              {permissions.indexOf('lecture_course_content_management') > -1 ? (
                <Menu.Item key="/tr/coursecontent" style={{ background: '#3A404D' }}>
                    课程内容管理
                </Menu.Item>
                ) : (
                    ''
                  )}
              {permissions.indexOf('lecture_course_system_management') > -1 ? (
                <Menu.Item key="/tr/lessonsystem" style={{ background: '#3A404D' }}>
                    课程体系管理
                </Menu.Item>
                ) : (
                    ''
                  )}
              {permissions.indexOf('lecutre_courseware_management') > -1 || permissions.indexOf('lecutre_courseware_download_print_delete') > -1 ? (
                <Menu.Item key="/tr/bigClassCoursewareList" style={{ background: '#3A404D' }}>
                    大班课课件管理
                </Menu.Item>
                ) : (
                    ''
                  )}
              {permissions.indexOf('lecutre_clazz_standard_homework_management') > -1 ? (
                <Menu.Item key="/tr/largeClassHomeWork" style={{ background: '#3A404D' }}>
                    作业管理
                </Menu.Item>
                ) : (
                    ''
                  )}
            </Menu.SubMenu>
            ) : (
              ''
            )}

          {this.checkPermission(['official_staff_management', 'temporary_staff_management', 'role_permission_management'], false) ?
            <Menu.SubMenu key="sub7" title={<span><Icon type="credit-card" /><span>权限管理</span></span>} style={subItemStyle}>
              {permissions.indexOf('official_staff_management') > -1 ?
                <Menu.Item key="/tr/officialpersonnel" style={{ background: '#3A404D' }}>正式人员管理</Menu.Item> : ''}
              {permissions.indexOf('temporary_staff_management') > -1 ?
                <Menu.Item key="/tr/temporarypersonnel" style={{ background: '#3A404D' }}>临时人员管理</Menu.Item> : ''}
              {permissions.indexOf('role_permission_management') > -1 ?
                <Menu.Item key="/tr/rolesmanage" style={{ background: '#3A404D' }}>角色权限分配</Menu.Item> : ''}
              {permissions.indexOf('role_permission_management') > -1 ?
                <Menu.Item key="/tr/standardwages-management" style={{ background: '#3A404D' }}>题库工资标准配置</Menu.Item> : ''}
              {permissions.indexOf('role_permission_management') > -1 ?
                <Menu.Item key="/tr/standardwages-data" style={{ background: '#3A404D' }}>临时人员工资结算</Menu.Item> : ''}
            </Menu.SubMenu> : ''}
          {this.checkPermission(['data_board'], false) ? (
            <Menu.SubMenu
              key="sub8"
              title={
                <span>
                  <Icon type="area-chart" />
                  <span>数据看板</span>
                </span>
              }
              style={subItemStyle}
            >
              <Menu.Item key="/tr/dataview" style={{ background: '#3A404D' }}>
                每周作业、监课数据收集
              </Menu.Item>
              <Menu.Item key="/tr/zmldataview" style={{ background: '#3A404D' }}>
                ZML课件使用情况汇总
              </Menu.Item>
              <Menu.Item key="/tr/dataviewcharts" style={{ background: '#3A404D' }}>
                图形化显示
              </Menu.Item>
              <Menu.Item key="/data/homework" style={{ background: '#3A404D' }}>
                作业报表
              </Menu.Item>
            </Menu.SubMenu>
          ) : (
              ''
            )}
          {
            <Menu.SubMenu
              key="sub11"
              title={
                <span>
                  <Icon type="database" />
                  <span>题目打印</span>
                </span>
              }
              style={subItemStyle}
            >
              <Menu.Item key="/tr/questionPrint" style={{ background: '#3A404D' }}>
                题目打印
              </Menu.Item>
            </Menu.SubMenu>
          }
          <Menu.SubMenu
            key="sub9"
            title={
              <span>
                <Icon type="user" />
                <span>个人中心</span>
              </span>
            }
            style={subItemStyle}
          >
            <Menu.Item key="/tr/personmsgmanager" style={{ background: '#3A404D' }}>
              个人信息
            </Menu.Item>
            <Menu.Item key="/tr/personpassword" style={{ background: '#3A404D' }}>
              修改密码
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
        <Alert
          properties={Object.assign(
            {},
            {
              // buttonsType: '1',
              // imgType: 'success',
              title: '数据获取中...',
              isOpen: this.props.alertShowOrHide,
              titleStyle: { textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 600 },
              child: ['知道了'],
              oneClick: () => {
                this.props.dispatch(changeAlertShowOrHideAction(false));
                this.props.dispatch(setAlertStatesAction(fromJS({})));
              }
            },
            this.props.alertStates.toJS()
          )}
        >
          {this.props.alertStates.get('warningMsg') ? (
            <FlexCenter>
              <div>{this.props.alertStates.get('warningMsg')}</div>
            </FlexCenter>
          ) : (
            LoadingIndicator()
          )}
        </Alert>
        <Alert
          properties={Object.assign(
            {},
            {
              buttonsType: '2-21',
              isOpen: this.props.backPromptAlertShow,
              title: '系统提示',
              titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333' },
              leftClick: () => {
                this.props.dispatch(changeBackPromptAlertShowAction(false));
              },
              rightClick: () => {
                this.props.dispatch(changeBackPromptAlertShowAction(false));
              },
              oneClick: () => {
                this.props.dispatch(changeBackPromptAlertShowAction(false));
              },
              child: ['取消', '确认'],
              buttonsIndent: 30
            },
            this.props.backAlertStates.toJS()
          )}
        >
          {this.props.backAlertStates.get('setChildren') ? (
            this.props.backAlertStates.get('setChildren')()
          ) : (
            <ChildWrapper>
              <p>是否确定退出？</p>
              <p>退出后将无法保存当前审核记录！</p>
            </ChildWrapper>
          )}
        </Alert>
      </BodyWrapper>
    );
  }
}

LeftNavC.propTypes = {
  dispatch: PropTypes.func.isRequired,
  alertShowOrHide: PropTypes.bool.isRequired, // 弹框显示或隐藏
  alertStates: PropTypes.instanceOf(immutable.Map).isRequired, // 弹框信息
  backPromptAlertShow: PropTypes.bool.isRequired, // 返回时提示弹框状态
  backAlertStates: PropTypes.instanceOf(immutable.Map).isRequired // 返回时弹框信息
};

const mapStateToProps = createStructuredSelector({
  LeftNavC: makeSelectLeftNavC(),
  alertShowOrHide: makeAlertShowOrHide(),
  alertStates: makeAlertStates(),
  backPromptAlertShow: makeBackPromptAlertShow(),
  backAlertStates: makebackAlertStates()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNavC);
