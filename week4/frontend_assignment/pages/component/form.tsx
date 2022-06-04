import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Field, ErrorMessage, Form, Formik } from "formik";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, number, date, InferType } from "yup";
import { TextField, Button, Paper, Box, FabProps } from "@mui/material";
import styles from "../styles/Home.module.css";

type FormInput = {
  name: string;
  age: number;
  address: string;
};

export default function Form() {
  let schema = object().shape({
    name: string().required(),
    age: number().positive().integer().required(),
    address: string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormInput> = (data) =>
    console.log("Input data = ", data);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("name")} />
          <input {...register("age")} />
          <input {...register("address")} />

          <input type="submit" />
        </form>
      </main>
    </div>
  );
}
