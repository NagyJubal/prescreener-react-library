import { gql } from "@apollo/client";

export const GET_PRESCREENER = gql`
  query GetPrescreener($survey_id: String) {
    GetPrescreener(survey_id: $survey_id) {
      prescreener
      prescreener_id
      survey_id
    }
  }
`;
export const ADD_PRESCREENER = gql`
  mutation AddPrescreener($survey_id: String, $prescreener: String) {
    AddPrescreener(survey_id: $survey_id, prescreener: $prescreener) {
      survey_id
      prescreener
      prescreener_id
    }
  }
`;
// export const UPDATE_PRESCREENER = gql`
//   mutation UpdatePrescreener(
//     survey_id: String
//     prescreener_id: String
//     prescreener: String
//   ){
//     UpdatePrescreener(
//       survey_id: $survey_id
//       prescreener_id: $prescreener_id
//       prescreener: $prescreener
//     ){
//       survey_id
//       prescreener
//       prescreener_id
//     }
//   }

// `;
