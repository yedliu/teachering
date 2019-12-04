import React from 'react';
import {Select } from 'antd';

export default class SelectBox extends React.PureComponent{
    constructor(props){
        super(props)
    }

    handleChange(value){
        console.log(value)
        this.props.onchange(value);
    }

    render(){
        let {opts, style, selectId} = this.props;
        return (
            <Select style={style} value={selectId.toString()} onChange={this.handleChange.bind(this)}>
                {
                    opts.map((item, index) => 
                        <Select.Option key={'sub-' + index} value={String(item.get('id') || item.get('code'))}>{item.get('name') || item.get('value')}</Select.Option>
                    )
                }
            </Select>
        )
    }
}