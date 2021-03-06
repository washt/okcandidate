import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import {
  fetchSurveyCandidateMatches
} from './../../redux/survey/survey-actions'

import {
  Col,
  Grid,
  Row
} from 'react-bootstrap'

import CandidateMatchCandidate from './../organisms/CandidateMatchCandidate.jsx'
import LoadingIndicator from './../atoms/LoadingIndicator.jsx'

class ResultsPage extends Component {

  constructor(props) {
    super(props)

    this.props.dispatch(fetchSurveyCandidateMatches(
      this.props.params.id
    ))

  }

  sortRaces(races) {
    return _.sortBy(races, race => {
      return race.candidateTypeName
    })
  }

  sortCandidates(candidates) {
    return _.sortBy(candidates, candidate => {
      return candidate.compositeMatchScore
    }).reverse()
  }

  render() {
    const survey = this.props.survey,
      races = survey.candidateMatch.survey
    return (
      <article>
        <Grid>
          <Row>
            <Col xs={12} sm={8} smOffset={2}>
              <h1>Matches</h1>
              {
                survey.isFetching || (races && races.length === 0) ?
                  <LoadingIndicator message="Loading Matches" /> :
                  this.sortRaces(races).map((race, index) => {
                    return (
                      <section key={index}>
                        <h2>{race.candidateTypeName}</h2>
                        {
                          this.sortCandidates(race.candidates)
                            .map((candidate, index) => {
                              return (
                                <CandidateMatchCandidate
                                  key={index}
                                  candidateName={candidate.candidateName}
                                  compositeMatchScore={candidate.compositeMatchScore}
                                  categoryMatchScores={candidate.categoryMatchScores} />
                              )
                            })
                        }
                      </section>
                    )
                  })
              }
            </Col>
          </Row>
        </Grid>
      </article>
    )
  }
}

ResultsPage.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  survey: PropTypes.object
}

export default connect(
  state => ({
    survey: state.survey
  })
)(ResultsPage)
