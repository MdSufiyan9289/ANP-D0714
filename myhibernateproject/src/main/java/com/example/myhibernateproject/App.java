package com.example.myhibernateproject;

import java.util.Scanner;

import com.example.myhibernateproject.util.OptionUtil;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
       Scanner sc=new Scanner(System.in);
       OptionUtil options=new OptionUtil();
       options.loginPage(sc);
    }
}
