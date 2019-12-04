import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import MatchFragment from './CartoonExamda/matchFragment';
import FillFragment from './CartoonExamda/fillFragment';
import SortFragment from './CartoonExamda/sortFragment';
import ChoiceTemplate from './ChoiceTemplate';
import Title from './ChoiceTemplate/modules/Title';
// import { matchData } from './cartoonExamda/data';
class ZmExamda extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
        };
        this.resizeListener = null;
        this.matchWith = 1000;
        this.renderExamda = this.renderExamda.bind(this);
        this.bindResize = this.bindResize.bind(this);
    }

    componentDidMount() {
        // this.bindResize();
    }

    componentDidUpdate() {
        // this.bindResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
    bindResize() {
        const { question } = this.props;
        const newQuestion = question.get('questionOutputDTO')
            ? question
                  .get('questionOutputDTO')
                  .merge(question.delete('questionOutputDTO'))
            : question;
        const templateType = newQuestion.get('templateType');
        // const stuAnswer = newQuestion.get('stuAnswer');
        if (templateType === 6) {
            const editBox = document.getElementById('matchBox');
            window.addEventListener(
                'resize',
                (this.resizeListener = () => {
                    if (!editBox) return;
                    const parent = editBox.parentNode;
                    const parentWidth = parent.offsetWidth;
                    this.setState({
                        scale: parentWidth / this.matchWith,
                    });
                })
            );
            this.resizeListener();
        }
    }
    renderExamda() {
        const { question, ...otherProps } = this.props;
        const newQuestion = question.get('questionOutputDTO')
            ? question
                  .get('questionOutputDTO')
                  .merge(question.delete('questionOutputDTO'))
            : question;
        const templateType = newQuestion.get('templateType');
        if ([1, 2, 3, 4, 8].includes(templateType)) {
            return <ChoiceTemplate {...otherProps} question={newQuestion} />;
        }
        const title = newQuestion.get('title');
        switch (templateType) {
            case 5: // 分类
                return (
                    <div>
                        <Title {...otherProps} content={title} />
                        <SortFragment
                            {...otherProps}
                            question={newQuestion}
                            stuAnswer={newQuestion.get('stuAnswer')}
                        />
                    </div>
                );
            case 6: // 配对
                return (
                    <div
                        id="matchBox"
                        style={{
                            transform: `scale(${this.state.scale})`,
                            width: this.matchWith,
                            height: 'auto',
                            transformOrigin: '0 0',
                        }}
                    >
                        {/* <button onClick={() => this.setState({show: !this.state.show})}>点我</button> */}
                        <Title {...otherProps} content={title} />
                        {/* <MatchFragment
            {...otherProps}
            interactive
            showRightAnswer={this.state.show}
            question={newQuestion}
            stuAnswer={matchData} /> */}
                        <MatchFragment
                            {...otherProps}
                            question={newQuestion}
                            stuAnswer={newQuestion.get('stuAnswer')}
                        />
                    </div>
                );
            case 7: // 选词填空
                return (
                    <div>
                        <Title {...otherProps} content={title} />
                        <FillFragment
                            {...otherProps}
                            question={newQuestion}
                            stuAnswer={newQuestion.get('stuAnswer')}
                        />
                    </div>
                );
            default:
                return (
                    <span style={{ color: 'red' }}> 未找到该题对应的模板</span>
                );
        }
    }

    render() {
        return this.renderExamda();
    }
}

ZmExamda.defaultProps = {
    handleChange: () => {},
    stuAnswer: '',
};

ZmExamda.propTypes = {
    question: PropTypes.instanceOf(Map).isRequired,
};

export default ZmExamda;
