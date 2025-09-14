import React from "react";
import "./Loader.scss";
import { Spin } from 'antd';

const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
const Loader = ({ loading }) => {
  return loading ? (
    <div className="loader-container">
      <Spin size="30px">{content}</Spin>
    </div>
  ) : null;
};

export default Loader;