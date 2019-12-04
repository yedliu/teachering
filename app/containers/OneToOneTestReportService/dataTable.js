import React from 'react';
import { Table } from 'antd';
import { TableButtonsWrapper, ImgThumbnail } from './style';
import UpLoadImage from './upLoadImage';
const { Column } = Table;


const isUrl = (url) => (url && url.length > 10);
const renderImg = (url) => {
  if (isUrl(url)) {
    return (<ImgThumbnail src={url} />);
  } else {
    return '【暂无图片】';
  }
};

const DataTable = (props) => {
  const {
    dataList, loading, tableScrollY, previewImg, preUploadImg,
    finishUpload,
  } = props;
  return (
    <Table
      dataSource={dataList}
      rowKey={record => record.id || record.name}
      bordered
      pagination={false}
      loading={loading}
      scroll={{ y: tableScrollY }}
    >
      <Column
        title="模块名称"
        dataIndex="moduleName"
        key="moduleName"
        width="20%"
      />
      <Column
        title="PC版本图片"
        dataIndex="pcPictureUrl"
        key="pcPictureUrlShow"
        width="20%"
        render={renderImg}
      />
      <Column
        title="操作"
        dataIndex="pcPictureUrl"
        key="pcPictureUrl"
        width="20%"
        render={(url, record, index) => {
          const hasUrl = isUrl(url);
          let res = (
            <TableButtonsWrapper>
              <UpLoadImage
                size="small"
                btnText={hasUrl ? '重新上传' : '上传'}
                showType={hasUrl ? 'all' : 'upload'}
                type="PC"
                moduleId={record.id}
                url={record.pcPictureUrl}
                finishUpload={finishUpload}
                previewImg={previewImg}
                preUploadImg={() => preUploadImg({
                  url: record.pcPictureUrl,
                  type: 'PC',
                  id: record.id,
                })}
              />
            </TableButtonsWrapper>
          );
          return res;
        }}
      />
      <Column
        title="h5版本图片"
        dataIndex="h5PictureUrl"
        key="h5PictureUrlShow"
        width="20%"
        render={renderImg}
      />
      <Column
        title="操作"
        dataIndex="h5PictureUrl"
        key="h5PictureUrl"
        width="20%"
        render={(url, record, index) => {
          const hasUrl = isUrl(url);
          let res = (
            <TableButtonsWrapper>
              <UpLoadImage
                size="small"
                btnText={hasUrl ? '重新上传' : '上传'}
                showType={hasUrl ? 'all' : 'upload'}
                type="h5"
                moduleId={record.id}
                url={record.h5PictureUrl}
                finishUpload={finishUpload}
                previewImg={previewImg}
                preUploadImg={() => preUploadImg({
                  url: record.h5PictureUrl,
                  type: 'h5',
                  id: record.id,
                })}
              />
            </TableButtonsWrapper>
          );
          return res;
        }}
      />

    </Table>
  );
};

export default DataTable;