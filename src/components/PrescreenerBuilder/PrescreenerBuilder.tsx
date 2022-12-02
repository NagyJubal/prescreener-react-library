import React, { useState, createContext, useEffect } from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { InfoNode, EditInfoNode } from "./InfoNode";
import { SingleSelect, EditSingleSelect } from "./SingleSelect";
import { PrescreenerPreview } from "./PrescreenerPreview";
import { ADD_PRESCREENER, GET_PRESCREENER } from "./queries";
import { Button } from "@mui/material";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
} from "@apollo/client";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const AppContext = createContext<any | null>(null);

export interface PrescreenerBuilderProps {
  surveyId: string;
  apollo_uri: string;
}

export interface InfoNodeInterface {
  type: string;
  question_text: string;
  question_id: string;
}
export interface SingleSelectInterface {
  type: string;
  question_text: string;
  question_id: string;
  rows: { label: string; terminate: boolean }[];
}

const PrescreenerBuilder = (props: PrescreenerBuilderProps) => {
  const client = new ApolloClient({
    uri: props.apollo_uri,
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <ExtraLayerToWaitServerResponse {...props} />
    </ApolloProvider>
  );
};
const ExtraLayerToWaitServerResponse = (props: any) => {
  const {
    data: prescreenerData = {
      GetPrescreener: {
        prescreener: "[]",
        prescreener_id: "",
        survey_id: props.surveyId,
      },
    },
    loading,
    error,
  } = useQuery(GET_PRESCREENER, { variables: { survey_id: props.surveyId } });
  if (error) {
    console.log(
      "🚀 ~ file: PrescreenerBuilder.tsx ~ line 68 ~ ExtraLayerToWaitServerResponse ~ error",
      error
    );
  }
  return (
    <>
      {!loading && (
        <MainContainer
          {...props}
          prescreener={prescreenerData.GetPrescreener.prescreener}
        />
      )}
    </>
  );
};

const MainContainer = (props: any) => {
  const prescreener = convertPayloadJsonBack(JSON.parse(props.prescreener));
  const [AddPrescreener, { data }] = useMutation(ADD_PRESCREENER, {
    onCompleted(data) {
      console.log("saved to server");
      console.log(data);
    },
    onError(error) {
      alert("error saving to server");
      console.log(error);
    },
  });

  const handleSave = () => {
    let payload: any = convertPayloadJson(questionArray);
    AddPrescreener({
      variables: {
        survey_id: props.surveyId,
        prescreener: payload,
      },
    });
  };

  const [editing, SetEditing] = useState({
    state: false,
    type: "none",
    editing: false,
  });
  const [editingQuestion, SetEditingQuestion] = useState<any>({});

  const [questionArray, SetQuestionArray] =
    useState<(SingleSelectInterface | InfoNodeInterface)[]>(prescreener);

  const addToQuestionArray = (
    question: InfoNodeInterface | SingleSelectInterface
  ) => {
    const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
      ...questionArray,
    ];
    myTuple.push(question);
    SetQuestionArray(myTuple);
  };
  const changeInQuestionArray = (
    question: InfoNodeInterface | SingleSelectInterface,
    index: number
  ) => {
    const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
      ...questionArray,
    ];
    myTuple[index] = question;
    SetQuestionArray(myTuple);
  };
  const removeFromQuestionArray = (index: number) => {
    const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
      ...questionArray,
    ];
    if (index > -1) {
      myTuple.splice(index, 1);
      for (let i = index; i < myTuple.length; i++) {
        myTuple[i].question_id = `Q${i}`;
      }
      SetQuestionArray(myTuple);
    }
  };
  const swapInQuestionArray = (index: number, up: boolean) => {
    const swapElements = (index1: number, index2: number) => {
      const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
        ...questionArray,
      ];
      [myTuple[index1], myTuple[index2]] = [myTuple[index2], myTuple[index1]];
      SetQuestionArray(myTuple);
    };
    let index1: number;
    if (index > 0 && up) {
      index1 = index - 1;
      swapElements(index1, index);
    }
    if (index < getQuestionArrayLength() - 1 && !up) {
      index1 = index + 1;
      swapElements(index1, index);
    }
  };
  const getQuestionArrayLength = () => {
    return questionArray.length;
  };

  return (
    <AppContext.Provider
      value={{
        editing,
        SetEditing,
        editingQuestion,
        SetEditingQuestion,
        getQuestionArrayLength,
        addToQuestionArray,
        changeInQuestionArray,
        removeFromQuestionArray,
        swapInQuestionArray,
      }}
    >
      <Grid container spacing={1}>
        {!editing.state && (
          <>
            <Grid item xs={1.5}>
              <Item>Components</Item>
              <Item>
                <InfoNode />
              </Item>
              <Item>
                <SingleSelect />
              </Item>
            </Grid>
            <Grid item xs={10}>
              <PrescreenerPreview questionArray={questionArray} />
              <div style={{ textAlign: "right" }}>
                <Button
                  disabled={questionArray.length > 0 ? false : true}
                  color={"primary"}
                  onClick={handleSave}
                  variant={"outlined"}
                >
                  {prescreener.length > 0 ? "Update" : "Save"}
                </Button>
              </div>
            </Grid>
          </>
        )}
        {editing.state && editing.type == "single" && <EditSingleSelect />}
        {editing.state && editing.type == "info" && <EditInfoNode />}
      </Grid>
    </AppContext.Provider>
  );
};

export default PrescreenerBuilder;

const convertPayloadJson: any = (questionArrayToConvert: any[]) => {
  let payload: any = [];
  for (let i = 0; i < questionArrayToConvert.length; i++) {
    if (questionArrayToConvert[i].type == "info") {
      payload.push({
        label: questionArrayToConvert[i].question_text,
        optionsLabelPosition: "right",
        inline: false,
        tableView: false,
        values: [],
        validate: {
          required: false,
        },
        errorLabel: "Please provide an answer.",
        key: questionArrayToConvert[i].question_id,
        type: "radio",
        input: true,
      });
    } else if (questionArrayToConvert[i].type == "single") {
      let values = questionArrayToConvert[i].rows.map(
        (row: any, index: any) => ({
          label: row.label,
          values: index.toString(),
          shortcut: "",
          terminate: row.terminate,
        })
      );
      payload.push({
        label: questionArrayToConvert[i].question_text,
        optionsLabelPosition: "right",
        inline: false,
        tableView: false,
        values: values,
        validate: {
          required: true,
        },
        errorLabel: "Please provide an answer.",
        key: questionArrayToConvert[i].question_id,
        type: "radio",
        input: true,
      });
    }
  }
  return JSON.stringify(payload);
};
const convertPayloadJsonBack: any = (questionArrayToConvert: any[]) => {
  let initArray: any = [];
  for (let i = 0; i < questionArrayToConvert.length; i++) {
    if (questionArrayToConvert[i].values.length > 0) {
      let rows = questionArrayToConvert[i].values.map(
        (row: any, index: any) => ({
          label: row.label,
          terminate: row.terminate,
        })
      );
      initArray.push({
        question_id: questionArrayToConvert[i].key,
        question_text: questionArrayToConvert[i].label,
        type: "single",
        rows: rows,
      });
    } else {
      initArray.push({
        question_id: questionArrayToConvert[i].key,
        question_text: questionArrayToConvert[i].label,
        type: "info",
      });
    }
  }
  return initArray;
};
