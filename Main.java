/**
 * Main
 */
public class Main {
  public static void main(String[] args) {
    
  }

  public static List<List<Integer>> getAllCombinationSum(int[] candidates, int target) {
    int len = candidates.length;
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> list = new ArrayList<>();
    if (len == 0)
        return res;
    //先排个序
    Arrays.sort(candidates);
    calculate(res, list, candidates, target, 0);
    return res;
}

  private static boolean calculate(List<List<Integer>> res, List<Integer> list, int[] candidates, int target, int start) {
    if (target < 0)
        return false;
    else if (target == 0) {
        List<Integer> temp = new ArrayList<>(list);
        res.add(temp);
        return false;
    } else {
        for (int i = start; i < candidates.length; i++) {
            list.add(candidates[i]);
            boolean flag = calculate(res, list, candidates, target - candidates[i], i);
            list.remove(list.size() - 1);
            if (!flag)
                break;
        }
    }
    return true;
}
  
}