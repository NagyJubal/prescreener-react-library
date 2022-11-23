import React, { useState, useContext } from "react";
import Chip from "@mui/material/Chip";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { AppContext, InfoNodeInterface } from "./PrescreenerBuilder";

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "block",
    margin: "0 auto",
  },
  textField: {
    "& > *": {
      marginTop: "20px",
      width: "25%",
    },
  },
  textArea: {
    "& > *": {
      width: "100%",
      marginTop: "20px",
    },
  },
  submitButton: {
    marginTop: "24px",
    marginRight: "10px",
  },
  title: { textAlign: "center" },
  subTitle: { textAlign: "left" },
  successMessage: { color: "green" },
  errorMessage: { color: "red" },
  previewCanvas: {
    width: "90%",
    height: "70%",
    padding: "20px",
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const InfoNode = () => {
  const { SetEditing } = useContext(AppContext);
  const onClickAdd = () => {
    SetEditing({ state: true, type: "info", editing: false });
  };
  return (
    <Item onClick={onClickAdd}>
      <Chip label="Info Node" variant="outlined" />
      <Fab size="small" color="secondary" aria-label="add">
        <AddIcon />
      </Fab>
    </Item>
  );
};

interface EditInfoNodeProps {
  question_data?: JSON;
  addToQuestionArray?: Function;
  index?: number;
}

interface FormValues {
  type: string;
  question_text: string;
  question_id: string;
}

interface myFormStatus {
  message: string;
  type: string;
}

interface myFormStatusProps {
  [key: string]: myFormStatus;
}

const formStatusProps: myFormStatusProps = {
  success: {
    message: "Added successfully.",
    type: "success",
  },
  error: {
    message: "Something went wrong. Please try again.",
    type: "error",
  },
};

export const EditInfoNode = (props: EditInfoNodeProps) => {
  const { SetEditing } = useContext(AppContext);
  const closeEditing = () => {
    SetEditing({ state: false, type: "none", editing: false });
  };
  const addToMainArray = (data: InfoNodeInterface) => {
    if (props.addToQuestionArray) props.addToQuestionArray(data);
  };
  const classes = useStyles();
  const [displayFormStatus, setDisplayFormStatus] = useState(false);
  const [formStatus, setFormStatus] = useState<myFormStatus>({
    message: "",
    type: "",
  });

  const saveForm = async (data: FormValues, resetForm: Function) => {
    try {
      if (data) {
        console.log(
          "🚀 ~ file: InfoNode.tsx ~ line 123 ~ saveForm ~ data",
          data
        );
        setFormStatus(formStatusProps.success);
        addToMainArray(data);
        closeEditing();
        //resetForm({});
      }
      //closeEditing();
    } catch (error: any) {
      const response = error.response;
      setFormStatus(formStatusProps.error);
    } finally {
      setDisplayFormStatus(true);
    }
  };
  const handleCancel = () => {
    console.log("Cancel");
    closeEditing();
  };
  const handleDelete = () => {
    console.log("Delete");
    closeEditing();
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          type: "info",
          question_text: "",
          question_id: `Q${props.index}`,
        }}
        onSubmit={(values: FormValues, actions) => {
          saveForm(values, actions.resetForm);
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 500);
        }}
        validationSchema={Yup.object().shape({
          question_id: Yup.string().required(
            "Something went wrong with the ID"
          ),
          question_text: Yup.string().required("Please enter some Text!"),
        })}
      >
        {(props: FormikProps<FormValues>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
          } = props;
          return (
            <Form>
              <h1 className={classes.title}>Info Node</h1>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <Grid container>
                    <Grid
                      item
                      lg={10}
                      md={10}
                      sm={10}
                      xs={10}
                      className={classes.textField}
                    >
                      <TextField
                        name="question_id"
                        id="question_id"
                        label="Question ID"
                        disabled
                        value={values.question_id}
                        type="text"
                        helperText={
                          errors.question_id && touched.question_id
                            ? errors.question_id
                            : ""
                        }
                        error={
                          errors.question_id && touched.question_id
                            ? true
                            : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={10}
                      md={10}
                      sm={10}
                      xs={10}
                      className={classes.textArea}
                    >
                      <TextField
                        multiline
                        rows={7}
                        name="question_text"
                        id="question_text"
                        label="Question Text"
                        value={values.question_text}
                        type="text"
                        helperText={
                          errors.question_text && touched.question_text
                            ? errors.question_text
                            : ""
                        }
                        error={
                          errors.question_text && touched.question_text
                            ? true
                            : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                      <Button
                        className={classes.submitButton}
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        className={classes.submitButton}
                        onClick={handleCancel}
                        variant="contained"
                        color="warning"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        className={classes.submitButton}
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={isSubmitting}
                      >
                        Delete
                      </Button>
                      {displayFormStatus && (
                        <div className="formStatus">
                          {formStatus.type === "error" ? (
                            <p className={classes.errorMessage}>
                              {formStatus.message}
                            </p>
                          ) : formStatus.type === "success" ? (
                            <p className={classes.successMessage}>
                              {formStatus.message}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <h1 className={classes.subTitle}>Preview</h1>
                  <Paper elevation={3} className={classes.previewCanvas}>
                    {values.question_text}
                  </Paper>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
