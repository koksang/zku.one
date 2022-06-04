pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;  

   // intermediate signal for product of a & b
   signal ab;
   ab <-- a * b;

   // Constraints.  
   // then we multiply ab with c to create quadratic function
   d <== ab * c;  
}

component main = Multiplier3();