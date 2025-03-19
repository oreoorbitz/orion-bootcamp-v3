
//Calcular moles//
fn calcular_moles(masa: f32, masa_molecular: f32) -> f32 {
  masa / masa_molecular
}

const MASA_NACL: f32 = 10.0;
const MASA_MOLAR_NACL: f32 = 58.44;

fn main() {
  println!("SOY GAY");
}

///

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calcular_moles() {
      assert_eq!(calcular_moles( MASA_NACL, MASA_MOLAR_NACL), 0.17111568);
    }
   /*  fn test_edad_en_dias_1_anio() {
        assert_eq!(edad_en_dias(1), 365);
    } */
  }
