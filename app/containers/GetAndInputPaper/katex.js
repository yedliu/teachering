import React, { PropTypes } from 'react';
import * as ReactKaTeX from 'react-katex';
import styled from 'styled-components';
import { Button } from 'antd';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';

const InlineMath = ReactKaTeX.InlineMath;

const Box = styled(FlexColumn) `
    width:100%;
    margin-top:10px;
    background:#f5f6f8
`
const Line = styled(FlexRow) `
    height:'30px';
    justify-content:space-around;
    align-items:center
`
const viewBox = {
    minHeight: '60px',
    overflow: 'auto',
    flex: '1',
    paddingLeft: '5px',
    border: '1px solid #ddd',
    margin: '5px 10px',
    background: '#fff'
}
const viewBtn = {
    margin: '0 5px'
}
export default class Katex extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showInput: false,
            str: '\\int_0^\\infty x^2 dx',
            preview: ''
        }
    }
    componentDidMount() {
    }
    mathTransform() {
        console.log(this.state.str)
        this.setState({ preview: this.state.str })
    }
    valueToState(e) {
        this.setState({ str: e.target.value })
    }
    getHTML() {
        // console.log('html',this.refs.HTML_CONTENT.innerHTML)
        this.props.getContent(this.refs.HTML_CONTENT.innerHTML)
        this.toggle()
    }
    toggle() {
        this.setState({ showInput: !this.state.showInput })
    }
    openWindow() {
        window.open('https://khan.github.io/KaTeX/function-support.html', '_blank', 'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=600', false)
    }
    render() {
        const showInput = this.state.showInput
        const mathBlock = () => {
            let result = []
            let mathList = []
            let o_str = this.state.preview.replace(/\\\[|\\]/g,'$')
            if(/\$/g.test(o_str)){
                let _str =  (o_str || '').replace(/\$([^\$]+)\$/g,function(e,$1){
                    console.log(e)
                    mathList.push(<InlineMath key={e + Math.random() * 1000}
                        renderError={(error) => {
                            return <b>Fail: {error.name}</b>
                        }}
                    >{$1}</InlineMath>)
                    return '$###$'
                })
                console.log('mathList', mathList)
                var arr = _str.split('$')
                console.log('arr', arr)
                arr.map((e, i) => {
                    if (e == '###') {
                        result.push(mathList.shift())
                    } else {
                        result.push(<span key={i}>{e}</span>)
                    }
                })
                return result
            } else {
                return <InlineMath
                    renderError={(error) => {
                        return <b>Fail: {error.name}</b>
                    }}
                >{this.state.preview}</InlineMath>
            }

        }
        return (
            <Box style={{ position: 'relative' }}>


                {
                    showInput ? <Box className='mathBox'  >
                        <Line>
                            <p style={{ textAlign: 'left' }} onClick={this.openWindow.bind(this)}><a href="javascript:void(0)">&gt;&gt;语法参考&lt;&lt;</a></p>
                        </Line>
                        <Line>
                            <textarea style={viewBox} value={this.state.str} onChange={this.valueToState.bind(this)}></textarea>
                            <Button style={viewBtn} size='small' onClick={this.mathTransform.bind(this)}>预览</Button>
                        </Line>
                        <Line>
                            <div style={viewBox} ref='HTML_CONTENT'>
                                {mathBlock()}
                            </div>
                            <Button style={viewBtn} size='small' onClick={this.getHTML.bind(this)}>插入</Button>
                        </Line>
                    </Box> : ''
                }
                {
                    this.state.showInput ? "" :
                        <FlexRow style={{justifyContent:'flex-end'}}>
                                <Button type='dashed' size='small' style={{color:'#ccc',margin:'2px 7px'}} onClick={this.toggle.bind(this)}>插入公式</Button>
                        </FlexRow>
                }                
            </Box>
        )
    }
}
Katex.propTypes = {
    getContent: PropTypes.func.isRequired
};
