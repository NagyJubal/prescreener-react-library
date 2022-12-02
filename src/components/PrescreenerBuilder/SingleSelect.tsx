import React, { useState, useContext } from "react";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Formik, Form, FormikProps, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import ClearIcon from "@mui/icons-material/Clear";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { SingleSelectInterface } from "./PrescreenerBuilder";
import { AppContext } from "./PrescreenerBuilder";

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

export const SingleSelect = () => {
  const { SetEditing } = useContext(AppContext);
  const onClickAdd = () => {
    SetEditing({ state: true, type: "single" });
  };
  return (
    <Item onClick={onClickAdd}>
      <Chip
        color="primary"
        label="Single Select"
        variant="outlined"
        onDelete={() => {}}
        deleteIcon={<AddIcon />}
      />
    </Item>
  );
};

interface FormValues {
  type: string;
  question_text: string;
  question_id: string;
  rows: {
    label: string;
    terminate: boolean;
  }[];
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

export const EditSingleSelect = () => {
  const {
    editing,
    SetEditing,
    editingQuestion,
    SetEditingQuestion,
    getQuestionArrayLength,
    addToQuestionArray,
    changeInQuestionArray,
    removeFromQuestionArray,
  } = useContext(AppContext);
  const index = editing.editing
    ? editingQuestion.index
    : getQuestionArrayLength();
  const closeEditing = () => {
    SetEditing({ state: false, type: "none" });
    SetEditingQuestion({});
  };
  const addToMainArray = (data: SingleSelectInterface) => {
    addToQuestionArray(data);
  };
  const changeInMainArray = (data: SingleSelectInterface, index: number) => {
    changeInQuestionArray(data, index);
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
        setFormStatus(formStatusProps.success);
        editing.editing ? changeInMainArray(data, index) : addToMainArray(data);
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
    if (editing.editing) {
      removeFromQuestionArray(index);
    }
    console.log("Delete");
    closeEditing();
  };

  return (
    <div key={index} className={classes.root}>
      <Formik
        initialValues={
          editing.editing
            ? editingQuestion.question
            : {
                type: "single",
                question_text: "",
                question_id: `Q${index}`,
                rows: [{ label: "", terminate: false }],
              }
        }
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
          rows: Yup.array().of(
            Yup.object().shape({
              label: Yup.string().required("can't be empty!"),
            })
          ),
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
                        rows={3}
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
                      <TableContainer component={Paper}>
                        <Table sx={{ width: "100%" }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell> Label</TableCell>

                              <TableCell>Terminate</TableCell>
                              <TableCell align="right">Remove</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <FieldArray
                              name="rows"
                              render={(arrayHelpers) => (
                                <>
                                  {values.rows.map((row, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        <TextField
                                          fullWidth
                                          name={`rows.${index}.label`}
                                          id={`rows.${index}.label`}
                                          label=""
                                          type="text"
                                          variant="outlined"
                                          value={row.label}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        ></TextField>
                                        <ErrorMessage
                                          name={`rows.${index}.label`}
                                          render={(msg) => (
                                            <span style={{ color: "red" }}>
                                              {msg}
                                            </span>
                                          )}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Switch
                                          name={`rows.${index}.terminate`}
                                          id={`rows.${index}.terminate`}
                                          checked={row.terminate}
                                          onChange={handleChange}
                                          inputProps={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="right">
                                        {
                                          <ClearIcon
                                            onClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                          />
                                        }
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <Button
                                    color={"primary"}
                                    onClick={() =>
                                      arrayHelpers.push({
                                        label: "",
                                        value: "",
                                        terminate: false,
                                      })
                                    }
                                    variant={"outlined"}
                                  >
                                    <AddIcon /> Add Another
                                  </Button>
                                </>
                              )}
                            />
                          </TableBody>
                        </Table>
                      </TableContainer>
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
                    <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">
                        {values.question_text}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                      >
                        {values.rows.map((row, index) => (
                          <FormControlLabel
                            value={row.label}
                            control={<Radio size="small" />}
                            label={row.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
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
